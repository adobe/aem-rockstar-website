/* global describe, it, afterEach */
import { expect } from '@esm-bundle/chai';
import { useFakeTimers } from 'sinon';
import decorate from '../../blocks/hof-nomination/hof-nomination.js';

const originalFetch = window.fetch;
const fixtures = [];
const schedule = {
  'Opens at': '2026-12-01T00:00:00-05:00',
  'Closes at': '2027-01-16T00:00:00-05:00',
};
let clock;

function fixture(open = true, windowConfig = {}) {
  const block = document.createElement('div');
  block.className = 'hof-nomination';
  block.innerHTML = `
    <div><div>Submit URL</div><div>https://forms.example.com/nominate</div></div>
    <div><div>Recognition year</div><div>2027</div></div>
    <div><div>Submissions open</div><div>${open}</div></div>
    <div><div>Cohorts</div><div><p>2026 | London</p><p>2027 | Sydney</p></div></div>
    ${Object.entries(windowConfig).map(([key, value]) => `<div><div>${key}</div><div>${value}</div></div>`).join('')}
  `;
  document.body.append(block);
  fixtures.push(block);
  decorate(block);
  return block;
}

function fill(block) {
  const values = {
    fullName: 'Test Nominee',
    email: 'nominee@example.com',
    cohort: '0',
    productionUrl: 'https://www.example.org/',
    aemLiveUrl: 'https://main--demo--example.aem.live/',
    repository: 'example/demo',
    repositoryVisibility: 'private',
    contribution: 'Implemented the site blocks and production launch.',
  };
  Object.entries(values).forEach(([name, value]) => {
    block.querySelector(`[name="${name}"]`).value = value;
  });
  block.querySelector('[name="consent"]').checked = true;
}

function submitAndWait(block) {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (block.querySelector('.hof-success') || block.querySelector('.hof-error')) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(block, { childList: true, subtree: true });
    block.querySelector('form').requestSubmit();
  });
}

afterEach(() => {
  clock?.restore();
  clock = undefined;
  window.fetch = originalFetch;
  fixtures.splice(0).forEach((block) => block.remove());
});

describe('Hall of Fame nomination', () => {
  it('shows only status and a local deadline, and opens automatically at the exact opening instant', () => {
    clock = useFakeTimers({
      now: Date.parse(schedule['Opens at']) - 1000,
      toFake: ['Date', 'setTimeout', 'clearTimeout'],
    });
    const block = fixture(true, schedule);
    fill(block);
    let requests = 0;
    window.fetch = () => { requests += 1; throw new Error('Unexpected request'); };
    expect(block.querySelector('.hof-submit').disabled).to.equal(true);
    expect(block.querySelector('.hof-window').textContent).to.include('not opened yet');
    const times = block.querySelectorAll('.hof-window time');
    expect(block.querySelector('.hof-window').children).to.have.length(2);
    expect(times).to.have.length(1);
    expect(times[0].dateTime).to.equal('2027-01-16T05:00:00.000Z');
    const format = new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    });
    expect(times[0].textContent).to.equal(format.format(Date.parse(schedule['Closes at'])));
    expect(block.querySelector('.hof-window').textContent).to.include('Deadline: ');
    block.querySelector('form').requestSubmit();
    expect(requests).to.equal(0);
    clock.tick(1000);
    expect(block.querySelector('.hof-submit').disabled).to.equal(false);
    expect(block.querySelector('.hof-window-state').textContent).to.equal('Nominations are open \u00b7 46 days left');
  });

  it('counts down days, switches below 24 hours, and closes automatically without losing entries', () => {
    clock = useFakeTimers({
      now: Date.parse(schedule['Closes at']) - 2 * 86400000,
      toFake: ['Date', 'setTimeout', 'clearTimeout'],
    });
    const block = fixture(true, schedule);
    fill(block);
    expect(block.querySelector('.hof-window').textContent).to.include('2 days left');
    clock.tick(86400000);
    expect(block.querySelector('.hof-window').textContent).to.include('1 day left');
    clock.tick(60000);
    expect(block.querySelector('.hof-window').textContent).to.include('Less than 24 hours left');
    clock.tick(86400000 - 60000);
    expect(block.querySelector('.hof-window').textContent).to.include('Nominations are closed');
    expect(block.querySelector('.hof-submit').disabled).to.equal(true);
    expect(block.querySelector('[name="fullName"]').value).to.equal('Test Nominee');
  });

  it('keeps the manual close override and rejects stale or programmatic submissions at the cutoff', () => {
    clock = useFakeTimers({
      now: Date.parse(schedule['Closes at']) - 1000,
      toFake: ['Date', 'setTimeout', 'clearTimeout'],
    });
    const paused = fixture(false, schedule);
    expect(paused.querySelector('.hof-submit').disabled).to.equal(true);
    expect(paused.querySelector('.hof-window').textContent).to.include('paused');
    const block = fixture(true, schedule);
    fill(block);
    expect(block.querySelector('.hof-submit').disabled).to.equal(false);
    clock.setSystemTime(Date.parse(schedule['Closes at']));
    let requests = 0;
    window.fetch = () => { requests += 1; throw new Error('Unexpected request'); };
    block.querySelector('form').requestSubmit();
    expect(requests).to.equal(0);
    expect(block.querySelector('.hof-submit').disabled).to.equal(true);
    expect(block.querySelector('.hof-status').textContent).to.include('closed');
  });

  it('fails visibly for incomplete, invalid, reversed, or timezone-less submission windows', () => {
    [
      { ...schedule, 'Closes at': '' },
      { ...schedule, 'Opens at': '2026-12-01T00:00:00' },
      { ...schedule, 'Opens at': '2026-02-30T00:00:00-05:00' },
      { ...schedule, 'Closes at': schedule['Opens at'] },
      { ...schedule, 'Closes at': 'not a date' },
    ].forEach((config) => {
      const block = fixture(true, config);
      expect(block.querySelector('form')).to.equal(null);
      expect(block.querySelector('[role="alert"]').textContent).to.include('configuration');
    });
  });

  it('never re-enables submission during a request or after failure beyond the closing instant', async () => {
    clock = useFakeTimers({
      now: Date.parse(schedule['Closes at']) - 120000,
      toFake: ['Date', 'setTimeout', 'clearTimeout'],
    });
    const block = fixture(true, schedule);
    fill(block);
    let resolveRequest;
    window.fetch = () => new Promise((resolve) => { resolveRequest = resolve; });
    const done = submitAndWait(block);
    clock.tick(60000);
    expect(block.querySelector('.hof-submit').disabled).to.equal(true);
    clock.tick(60000);
    resolveRequest(new Response('', { status: 503 }));
    await done;
    expect(block.querySelector('.hof-submit').disabled).to.equal(true);
    expect(block.querySelector('.hof-window').textContent).to.include('closed');
    expect(block.querySelector('.hof-error').textContent).to.include("couldn't confirm receipt");
    expect(block.querySelector('[name="email"]').value).to.equal('nominee@example.com');
  });

  it('keeps closed submissions gated and surfaces invalid configuration', () => {
    let requests = 0;
    window.fetch = () => { requests += 1; throw new Error('Unexpected request'); };
    const closed = fixture(false);
    expect(closed.querySelector('[type="submit"]').disabled).to.equal(true);
    closed.querySelector('form').requestSubmit();
    expect(requests).to.equal(0);
    expect(closed.querySelector('.hof-status').textContent).to.include('Nothing has been sent');
    const invalid = document.createElement('div');
    fixtures.push(invalid);
    decorate(invalid);
    expect(invalid.querySelector('form')).to.equal(null);
    expect(invalid.querySelector('[role="alert"]').textContent).to.include('configuration');
  });

  it('adds and removes site entries with unique labels, focus, and one entry remaining', () => {
    const block = fixture();
    const other = fixture();
    const add = [...block.querySelectorAll('button')]
      .find((button) => button.textContent === 'Add another site');
    add.click();
    const sites = block.querySelectorAll('.hof-site');
    expect(sites.length).to.equal(2);
    expect(sites[0].open).to.equal(false);
    expect(sites[1].open).to.equal(true);
    expect(document.activeElement).to.equal(sites[1].querySelector('input'));
    expect(new Set([...document.querySelectorAll('.hof-nomination [id]')]
      .map((node) => node.id)).size).to.equal(
      document.querySelectorAll('.hof-nomination [id]').length,
    );
    sites[0].querySelector('summary').click();
    sites[0].querySelector('.hof-remove').click();
    expect(block.querySelectorAll('.hof-site').length).to.equal(1);
    expect(block.querySelector('.hof-site-title').textContent).to.include('Site 1');
    expect(block.querySelector('.hof-site').open).to.equal(true);
    expect(block.querySelector('.hof-remove').disabled).to.equal(true);
    expect(document.activeElement).to.equal(block.querySelector('.hof-site input'));
    expect(other.querySelectorAll('.hof-site').length).to.equal(1);
  });

  it('keeps fields, errors and action labels readable across themes and submission states', async () => {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('../../blocks/hof-nomination/hof-nomination.css', import.meta.url).href;
    fixtures.push(stylesheet);
    await new Promise((resolve, reject) => {
      stylesheet.onload = resolve;
      stylesheet.onerror = reject;
      document.head.append(stylesheet);
    });
    const themeStyles = document.createElement('style');
    themeStyles.textContent = `
      body.rockstar-inner {
        --rockstar-ink: #181817;
        --rockstar-white: #f4f4ee;
        --ink: var(--rockstar-ink);
        --muted: var(--rockstar-ink);
        --card: var(--rockstar-white);
        --brand-1: #ef4937;
      }
    `;
    fixtures.push(themeStyles);
    document.head.append(themeStyles);
    const block = fixture();
    const form = block.querySelector('form');
    const error = block.querySelector('.hof-status');
    error.classList.add('hof-error');
    error.textContent = 'Unable to submit. Please try again.';
    const originalClass = document.body.className;
    const luminance = (color) => {
      const channels = color.match(/\d+/g).slice(0, 3).map((value) => {
        const channel = Number(value) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const contrast = (foreground, background) => {
      const text = luminance(foreground);
      const fillColor = luminance(background);
      return (Math.max(text, fillColor) + 0.05) / (Math.min(text, fillColor) + 0.05);
    };
    try {
      ['', 'masterclass', 'masterclass rockstar-site rockstar-inner rockstar-grunge'].forEach((theme) => {
        document.body.className = theme;
        const background = getComputedStyle(form).backgroundColor;
        block.querySelectorAll('.hof-field input, .hof-field select, .hof-field textarea').forEach((field) => {
          const style = getComputedStyle(field);
          expect(contrast(style.color, style.backgroundColor), `${theme || 'light'} field contrast`)
            .to.be.at.least(4.5);
        });
        expect(contrast(getComputedStyle(error).color, background), `${theme || 'light'} error contrast`)
          .to.be.at.least(4.5);
        const button = block.querySelector('button:not(.hof-remove)');
        expect(contrast(getComputedStyle(button).color, background), `${theme || 'light'} button text contrast`)
          .to.be.at.least(4.5);
        const submit = block.querySelector('.hof-submit');
        const surface = background.match(/\d+/g).slice(0, 3).map(Number);
        [false, true].forEach((disabled) => {
          submit.disabled = disabled;
          const style = getComputedStyle(submit);
          const opacity = Number(style.opacity);
          const painted = (color) => {
            const channels = color.match(/\d+/g).slice(0, 3)
              .map((value, index) => Math.round(
                Number(value) * opacity + surface[index] * (1 - opacity),
              ));
            return `rgb(${channels.join(',')})`;
          };
          const ratio = contrast(painted(style.color), painted(style.backgroundColor));
          expect(ratio, `${theme || 'light'} submit disabled=${disabled}`).to.be.at.least(4.5);
        });
      });
    } finally {
      document.body.className = originalClass;
    }
  });

  it('keeps twelve sites compact while retaining data and allowing earlier entries to reopen', () => {
    const block = fixture();
    fill(block);
    const add = [...block.querySelectorAll('button')]
      .find((button) => button.textContent === 'Add another site');
    Array.from({ length: 12 }, (_, index) => {
      if (index) add.click();
      const site = block.querySelectorAll('.hof-site')[index];
      Object.entries({
        productionUrl: `https://site${index}.example.org/`,
        aemLiveUrl: `https://main--site${index}--example.aem.live/`,
        repository: `example/site${index}`,
        repositoryVisibility: 'private',
        contribution: `Built and launched production site ${index}.`,
      }).forEach(([name, value]) => {
        site.querySelector(`[name="${name}"]`).value = value;
      });
      site.querySelector('input').dispatchEvent(new Event('input', { bubbles: true }));
      return site;
    });
    const sites = [...block.querySelectorAll('.hof-site')];
    expect(sites).to.have.length(12);
    expect(sites.filter((site) => site.open)).to.have.length(1);
    expect(sites[11].open).to.equal(true);
    expect(sites[0].querySelector('.hof-site-title').textContent).to.include('site0.example.org');
    expect(sites[0].querySelector('.hof-site-state').textContent).to.equal('Ready for review');
    sites[0].querySelector('summary').click();
    expect(sites[0].open).to.equal(true);
    expect(sites[11].open).to.equal(false);
    expect(sites[0].querySelector('[name="contribution"]').value)
      .to.equal('Built and launched production site 0.');
  });

  it('opens and focuses the first invalid collapsed site before reporting its error', () => {
    const block = fixture();
    fill(block);
    [...block.querySelectorAll('button')]
      .find((button) => button.textContent === 'Add another site').click();
    const sites = block.querySelectorAll('.hof-site');
    const invalid = sites[0].querySelector('[name="aemLiveUrl"]');
    invalid.value = 'https://not-an-eds-site.example.org/';
    let requests = 0;
    window.fetch = () => { requests += 1; throw new Error('Unexpected request'); };
    block.querySelector('form').requestSubmit();
    expect(sites[0].open).to.equal(true);
    expect(sites[1].open).to.equal(false);
    expect(document.activeElement).to.equal(invalid);
    expect(invalid.validationMessage).to.include('production EDS URL');
    expect(requests).to.equal(0);
  });

  it('rejects non-public URLs, impostor EDS hosts, and blank names', () => {
    const block = fixture();
    fill(block);
    let requests = 0;
    window.fetch = () => { requests += 1; throw new Error('Unexpected request'); };
    const invalidValues = [
      ['productionUrl', 'http://example.org/'],
      ['productionUrl', 'https://127.0.0.1/'],
      ['productionUrl', 'https://private.local/'],
      ['productionUrl', 'https://user:password@example.org/'],
      ['productionUrl', 'https://example.org/?token=private'],
      ['productionUrl', 'https://main--demo--example.aem.live/'],
      ['aemLiveUrl', 'https://main--demo--example.aem.live.example.com/'],
      ['aemLiveUrl', 'https://example.aem.live/'],
      ['fullName', '   '],
    ];
    invalidValues.forEach(([name, value]) => {
      const input = block.querySelector(`[name="${name}"]`);
      const previous = input.value;
      input.value = value;
      block.querySelector('form').requestSubmit();
      expect(input.validity.valid, `${name}: ${value}`).to.equal(false);
      input.value = previous;
    });
    expect(requests).to.equal(0);
  });

  it('rejects repeated EDS sites even when their production domains differ', () => {
    const block = fixture();
    expect(block.querySelector('[name="githubProfile"]')).to.equal(null);
    expect(block.querySelector('[name="evidence"]')).to.equal(null);
    fill(block);
    [...block.querySelectorAll('button')]
      .find((button) => button.textContent === 'Add another site').click();
    const second = block.querySelectorAll('.hof-site')[1];
    second.querySelector('[name="productionUrl"]').value = 'https://another.example.org/';
    second.querySelector('[name="aemLiveUrl"]').value = 'https://main--demo--example.aem.live';
    block.querySelector('form').requestSubmit();
    expect(second.querySelector('[name="aemLiveUrl"]').validationMessage)
      .to.include('already listed');
  });

  it('requires one unchecked consent for review and disclosure, not publication', () => {
    const block = fixture();
    expect(block.querySelectorAll('[type="checkbox"]')).to.have.length(1);
    const checkbox = block.querySelector('[name="consent"]');
    expect(checkbox.checked).to.equal(false);
    expect(checkbox.required).to.equal(true);
    expect(checkbox.closest('label').textContent).to.include("I'm authorized to share it");
    expect(block.textContent).to.include('Nothing will be published without your final profile approval.');
    fill(block);
    let requests = 0;
    window.fetch = () => { requests += 1; throw new Error('Unexpected request'); };
    checkbox.checked = false;
    block.querySelector('form').requestSubmit();
    expect(checkbox.validity.valueMissing).to.equal(true);
    expect(document.activeElement).to.equal(checkbox);
    expect(requests).to.equal(0);
  });

  it('preserves entries after failure and retries the same reference with a structured payload',
    async () => {
      const block = fixture();
      fill(block);
      block.querySelector('[name="cohort"]').value = '1';
      [...block.querySelectorAll('button')]
        .find((button) => button.textContent === 'Add another site').click();
      const secondSite = block.querySelectorAll('.hof-site')[1];
      Object.entries({
        productionUrl: 'https://second.example.org/',
        aemLiveUrl: 'https://main--second--example.aem.live/',
        repository: 'example/second',
        repositoryVisibility: 'public',
        contribution: 'Led the deployment of the second site.',
      }).forEach(([name, value]) => {
        secondSite.querySelector(`[name="${name}"]`).value = value;
      });
      const requests = [];
      window.fetch = async (url, options) => {
        requests.push({ url, options });
        if (requests.length === 1) return new Response('', { status: 503 });
        return Response.json({
          success: true, submissionId: options.body.get('submissionId'),
        });
      };
      await submitAndWait(block);
      expect(block.querySelector('[name="fullName"]').value).to.equal('Test Nominee');
      expect(block.querySelector('[name="consent"]').checked).to.equal(true);
      expect(block.querySelector('[type="submit"]').disabled).to.equal(false);
      const retry = submitAndWait(block);
      await retry;
      const first = requests[0].options.body;
      const second = requests[1].options.body;
      expect(second.get('submissionId')).to.equal(first.get('submissionId'));
      expect(second.get('attendanceYear')).to.equal('2027');
      expect(second.get('attendanceCity')).to.equal('Sydney');
      expect(second.get('consent')).to.equal('true');
      ['reviewConsent', 'disclosureConsent', 'publicationConsent'].forEach((name) => {
        expect(second.has(name)).to.equal(false);
      });
      expect(second.has('githubProfile')).to.equal(false);
      expect(JSON.parse(second.get('sites')).every((site) => !('evidence' in site))).to.equal(true);
      expect(JSON.parse(second.get('sites'))[0]).to.include({
        branch: 'main', site: 'demo', org: 'example', repositoryVisibility: 'private',
      });
      expect(JSON.parse(second.get('sites'))).to.have.length(2);
      expect(JSON.parse(second.get('sites'))[1]).to.include({
        site: 'second', repositoryVisibility: 'public',
      });
      expect(block.querySelector('.hof-success').textContent).to.include('Nomination received');
      expect(document.activeElement).to.equal(block.querySelector('.hof-success h3'));
    });

  it('does not report success for missing, malformed, or mismatched receipts', async () => {
    const block = fixture();
    fill(block);
    const responses = [
      () => Response.json({ message: 'Workflow was started' }),
      () => new Response('Not JSON'),
      () => Response.json({ success: true, submissionId: 'different-reference' }),
      () => { throw new DOMException('Timed out', 'TimeoutError'); },
    ];
    window.fetch = async () => responses.shift()();
    await submitAndWait(block);
    expect(block.querySelector('.hof-success')).to.equal(null);
    await submitAndWait(block);
    expect(block.querySelector('.hof-success')).to.equal(null);
    await submitAndWait(block);
    expect(block.querySelector('.hof-success')).to.equal(null);
    await submitAndWait(block);
    expect(block.querySelector('.hof-error').textContent).to.include("couldn't confirm receipt");
    expect(block.querySelector('[name="email"]').value).to.equal('nominee@example.com');
  });

  it('locks editing and prevents duplicate sends while a request is pending', async () => {
    const block = fixture();
    fill(block);
    let resolveRequest;
    let requests = 0;
    window.fetch = () => {
      requests += 1;
      return new Promise((resolve) => { resolveRequest = resolve; });
    };
    const done = submitAndWait(block);
    expect(block.querySelector('form').getAttribute('aria-busy')).to.equal('true');
    expect(block.querySelector('[type="submit"]').disabled).to.equal(true);
    expect([...block.querySelectorAll('fieldset')].every((node) => node.disabled)).to.equal(true);
    block.querySelector('form').requestSubmit();
    expect(requests).to.equal(1);
    resolveRequest(new Response('', { status: 500 }));
    await done;
    expect(block.querySelector('form').getAttribute('aria-busy')).to.equal('false');
    expect(block.querySelector('[type="submit"]').disabled).to.equal(false);
  });
});
