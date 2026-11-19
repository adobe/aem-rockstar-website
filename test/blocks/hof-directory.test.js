/* global describe, it, afterEach */
import { expect } from '@esm-bundle/chai';
import decorate from '../../blocks/hof-directory/hof-directory.js';

const fixtures = [];
const tiers = ['Rising Star', 'Hitmaker', 'Chart Topper', 'Icon'];

function makeBlock(members) {
  const block = document.createElement('div');
  block.className = 'hof-directory';
  members.forEach(([name, tier, portrait = false, profileHref]) => {
    const row = document.createElement('div');
    const image = document.createElement('div');
    if (portrait) {
      image.innerHTML = '<picture><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22/%3E" alt="Sample portrait"></picture>';
    }
    const title = document.createElement('div');
    title.textContent = name;
    if (profileHref) {
      const link = document.createElement('a');
      link.href = profileHref;
      link.textContent = name;
      title.replaceChildren(link);
    }
    const level = document.createElement('div');
    level.textContent = tier;
    row.append(image, title, level);
    block.append(row);
  });
  document.body.append(block);
  fixtures.push(block);
  return block;
}

function roster(count = 150) {
  return Array.from({ length: count }, (_, index) => [
    `Member ${String(index + 1).padStart(3, '0')}`,
    tiers[index % tiers.length],
  ]);
}

function filter(block, label) {
  return [...block.querySelectorAll('.hof-filters button')]
    .find((button) => button.textContent.startsWith(`${label} (`));
}

function search(block, value) {
  const input = block.querySelector('input[type="search"]');
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

afterEach(() => fixtures.splice(0).forEach((block) => block.remove()));

describe('Hall of Fame directory', () => {
  it('renders alphabetical photo/tier/name cards without profile links', () => {
    const block = makeBlock([['Zara Lee', 'Icon'], ['Alex Morgan', 'Rising Star', true]]);
    const picture = block.querySelector('picture');
    decorate(block);
    const cards = [...block.querySelectorAll('.hof-member')];
    expect(cards.map((card) => card.querySelector('h3').textContent))
      .to.deep.equal(['Alex Morgan', 'Zara Lee']);
    expect(cards[0].querySelector('picture')).to.equal(picture);
    expect(cards[0].querySelector('.hof-tier').textContent).to.equal('Rising Star');
    expect(block.querySelectorAll('a')).to.have.length(0);
    expect(filter(block, 'All').getAttribute('aria-pressed')).to.equal('true');
  });

  it('combines normalized full-roster name search with tier filtering', () => {
    const block = makeBlock([
      ['Elena Rossi', 'Icon'], ['Élena Brooks', 'Hitmaker'], ['Jordan Ellis', 'Hitmaker'],
    ]);
    decorate(block);
    search(block, ' ELENA ');
    expect(block.querySelectorAll('.hof-member')).to.have.length(2);
    filter(block, 'Hitmaker').click();
    expect(block.querySelectorAll('.hof-member')).to.have.length(1);
    expect(block.querySelector('.hof-member h3').textContent).to.equal('Élena Brooks');
    expect(filter(block, 'Hitmaker').textContent).to.equal('Hitmaker (2)');
    expect(filter(block, 'Hitmaker').getAttribute('aria-pressed')).to.equal('true');
    expect(filter(block, 'All').getAttribute('aria-pressed')).to.equal('false');
  });

  it('links only members with an authored profile and retains the link through filtering', () => {
    const path = '/en/masterclass/hall-of-fame/alex-morgan';
    const block = makeBlock([
      ['Alex Morgan', 'Rising Star', true, path], ['Zara Lee', 'Icon'],
    ]);
    decorate(block);
    expect(block.querySelectorAll('.hof-member a')).to.have.length(1);
    const link = block.querySelector('.hof-member-link');
    expect(link.getAttribute('href')).to.equal(path);
    expect(link.querySelector('h3').textContent).to.equal('Alex Morgan');
    expect(link.querySelector('picture')).not.to.equal(null);
    search(block, 'alex');
    filter(block, 'Rising Star').click();
    expect(block.querySelector('.hof-member-link')).to.equal(link);
  });

  it('does not turn unsafe or off-site profile references into clickable cards', () => {
    const block = makeBlock([
      ['Alex Morgan', 'Rising Star', false, 'javascript:alert(1)'],
      ['Zara Lee', 'Icon', false, 'https://example.com/en/masterclass/hall-of-fame/zara-lee'],
    ]);
    decorate(block);
    expect(block.querySelectorAll('.hof-member')).to.have.length(2);
    expect(block.querySelectorAll('.hof-member a')).to.have.length(0);
  });

  it('paginates 150 members, preserves access to later matches, and resets the page on filtering', () => {
    const block = makeBlock(roster());
    decorate(block);
    const more = block.querySelector('.hof-more');
    expect(block.querySelectorAll('.hof-member')).to.have.length(24);
    expect(block.querySelector('[role="status"]').textContent).to.include('24 of 150');
    more.click();
    expect(block.querySelectorAll('.hof-member')).to.have.length(48);
    expect(document.activeElement.textContent).to.include('Member 025');
    filter(block, 'Icon').click();
    expect(block.querySelectorAll('.hof-member')).to.have.length(24);
    more.click();
    expect(block.querySelectorAll('.hof-member')).to.have.length(37);
    expect(more.hidden).to.equal(true);
    filter(block, 'All').click();
    search(block, 'Member 150');
    expect(block.querySelectorAll('.hof-member')).to.have.length(1);
    expect(block.querySelector('.hof-member h3').textContent).to.equal('Member 150');
    expect(more.hidden).to.equal(true);
    search(block, '');
    while (!more.hidden) more.click();
    expect(block.querySelectorAll('.hof-member')).to.have.length(150);
    expect(new Set([...block.querySelectorAll('.hof-member h3')]
      .map((heading) => heading.textContent)).size).to.equal(150);
  });

  it('announces no results and resets search, tier and pagination together', () => {
    const block = makeBlock(roster());
    decorate(block);
    filter(block, 'Icon').click();
    search(block, 'Nobody matches');
    expect(block.querySelectorAll('.hof-member')).to.have.length(0);
    expect(block.querySelector('[role="status"]').textContent).to.include('No members match');
    expect(block.querySelector('.hof-more').hidden).to.equal(true);
    block.querySelector('.hof-reset').click();
    expect(block.querySelector('input').value).to.equal('');
    expect(filter(block, 'All').getAttribute('aria-pressed')).to.equal('true');
    expect(block.querySelectorAll('.hof-member')).to.have.length(24);
    expect(document.activeElement).to.equal(block.querySelector('input'));
  });

  it('reserves portrait dimensions and supplies initials when a portrait is omitted', () => {
    const block = makeBlock([
      ['Alex Morgan', 'Rising Star', true], ['Leila Haddad', 'Chart Topper'],
    ]);
    decorate(block);
    const image = block.querySelector('.hof-portrait img');
    expect(image.getAttribute('width')).to.equal('400');
    expect(image.getAttribute('height')).to.equal('400');
    expect(image.loading).to.equal('lazy');
    expect(block.querySelector('.hof-initials').textContent).to.equal('LH');
  });

  it('reports invalid authored rows rather than silently accepting an unknown tier', () => {
    const block = makeBlock([['Alex Morgan', 'Rising Star'], ['', 'Icon'], ['Sam Lee', 'Gold']]);
    // eslint-disable-next-line no-console
    const original = console.warn;
    const warnings = [];
    // eslint-disable-next-line no-console
    console.warn = (...args) => warnings.push(args);
    try {
      decorate(block);
      expect(warnings).to.have.length(2);
      expect(block.querySelector('.hof-content-error').textContent).to.include('2 member rows');
      expect(block.querySelectorAll('.hof-member')).to.have.length(1);
    } finally {
      // eslint-disable-next-line no-console
      console.warn = original;
    }
  });

  it('shows an explicit empty state before any members have been authored', () => {
    const block = makeBlock([]);
    decorate(block);
    expect(block.querySelector('[role="status"]').textContent).to.include('No members have been announced');
    expect(block.querySelector('.hof-more').hidden).to.equal(true);
  });
});
