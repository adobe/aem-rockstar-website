import { readBlockConfig } from '../../scripts/aem.js';

function element(tag, text = '', className = '') {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function publicUrl(value) {
  const url = new URL(value);
  const labels = url.hostname.split('.');
  if (url.protocol !== 'https:' || url.username || url.password || url.port
    || url.search || url.hash || labels.length < 2
    || labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))
    || /^\d+$/.test(labels.at(-1))
    || /(?:^|\.)(?:localhost|local|internal|test|invalid|example)$/.test(url.hostname)) {
    throw new Error('Use a public HTTPS URL without credentials, ports, query strings, or fragments.');
  }
  return url;
}

function aemProject(url) {
  const suffix = '.aem.live';
  const parts = url.hostname.endsWith(suffix)
    ? url.hostname.slice(0, -suffix.length).split('--') : [];
  if (parts.length !== 3 || parts.some((part) => !part)) {
    throw new Error('Use a production EDS URL such as https://main--site--org.aem.live/.');
  }
  const [branch, site, org] = parts;
  return { branch, site, org };
}

function submissionDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) {
    throw new Error('Opens at and Closes at must both be ISO timestamps with an explicit timezone.');
  }
  const timestamp = Date.parse(value);
  const calendar = Date.parse(value.replace(/(?:Z|[+-]\d{2}:\d{2})$/, 'Z'));
  if (!Number.isFinite(timestamp) || !Number.isFinite(calendar)
    || new Date(calendar).toISOString().slice(0, 19) !== value.slice(0, 19)) {
    throw new Error('Opens at and Closes at must contain valid dates and times.');
  }
  return timestamp;
}

function readConfig(block) {
  const config = readBlockConfig(block);
  const submitUrl = publicUrl(config['submit-url']).href;
  const recognitionYear = config['recognition-year'];
  const open = config['submissions-open'] ?? 'false';
  const rows = config.cohorts ? [].concat(config.cohorts) : [];
  const cohorts = rows.map((row) => {
    const parts = row.split('|').map((part) => part.trim());
    if (parts.length !== 2 || !/^\d{4}$/.test(parts[0]) || !parts[1]) {
      throw new Error('Each cohort must use the format "2026 | London".');
    }
    return { year: parts[0], city: parts[1] };
  });
  if (!/^\d{4}$/.test(recognitionYear) || !cohorts.length
    || !['true', 'false'].includes(open)) {
    throw new Error('Check Recognition year, Cohorts, and Submissions open configuration.');
  }
  let schedule;
  if (config['opens-at'] || config['closes-at']) {
    const opensAt = submissionDate(config['opens-at']);
    const closesAt = submissionDate(config['closes-at']);
    if (closesAt <= opensAt) throw new Error('Closes at must be after Opens at.');
    schedule = { opensAt, closesAt };
  }
  return {
    submitUrl, recognitionYear, cohorts, open: open === 'true', schedule,
  };
}

function field(parent, prefix, name, labelText, options = {}) {
  const {
    type = 'text', required = true, hint = '', choices, autocomplete = 'off', maxLength = 200,
  } = options;
  const wrapper = element('div', '', `hof-field${type === 'textarea' ? ' hof-wide' : ''}`);
  const id = `${prefix}-${name}`;
  const label = element('label', `${labelText}${required ? '' : ' (optional)'}`);
  label.htmlFor = id;
  const control = element(choices ? 'select' : type === 'textarea' ? 'textarea' : 'input');
  control.id = id;
  control.name = name;
  control.required = required;
  control.autocomplete = autocomplete;
  if (choices) {
    choices.forEach(([value, text]) => control.append(new Option(text, value)));
  } else {
    control.maxLength = maxLength;
    if (type === 'textarea') control.rows = 3;
    else control.type = type;
  }
  wrapper.append(label, control);
  if (hint) {
    const help = element('p', hint, 'hof-hint');
    help.id = `${id}-hint`;
    control.setAttribute('aria-describedby', help.id);
    wrapper.append(help);
  }
  parent.append(wrapper);
  return control;
}

function group(parent, title, className = '') {
  const fieldset = element('fieldset', '', className);
  fieldset.append(element('legend', title));
  parent.append(fieldset);
  return fieldset;
}

function permission(parent, prefix, name, text, required) {
  const label = element('label', '', 'hof-permission');
  const input = element('input');
  input.type = 'checkbox';
  input.name = name;
  input.id = `${prefix}-${name}`;
  input.required = required;
  input.autocomplete = 'off';
  label.append(input, element('span', `${text}${required ? '' : ' (optional)'}`));
  parent.append(label);
  return input;
}

function validate(controls, sites) {
  controls.forEach((control) => {
    control.setCustomValidity('');
    if (control.required && 'value' in control && !control.value.trim()) {
      control.setCustomValidity('Complete this required field.');
    }
  });
  const seenProduction = new Set();
  const seenAem = new Set();
  sites.forEach(({ fields }) => {
    ['productionUrl', 'aemLiveUrl'].forEach((key) => {
      const input = fields[key];
      if (!input.value.trim()) return;
      try {
        const url = publicUrl(input.value.trim());
        if (key === 'aemLiveUrl') aemProject(url);
        else if (/\.(?:aem|hlx)\.(?:live|page)$/.test(url.hostname)) {
          throw new Error('Enter the public production domain, not an EDS preview or live hostname.');
        }
        const seen = key === 'productionUrl' ? seenProduction : seenAem;
        const canonical = `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
        if (seen.has(canonical)) {
          throw new Error('This site is already listed. Do not add domain aliases as separate sites.');
        }
        seen.add(canonical);
      } catch (error) {
        input.setCustomValidity(error.message);
      }
    });
  });
}

function createForm(config) {
  const prefix = `hof-${crypto.randomUUID()}`;
  const submissionId = crypto.randomUUID();
  const form = element('form', '', 'hof-form');
  form.noValidate = true;
  const windowState = element('p', '', 'hof-window-state');
  windowState.setAttribute('role', 'status');
  windowState.setAttribute('aria-live', 'polite');
  windowState.setAttribute('aria-atomic', 'true');
  if (config.schedule) {
    const notice = element('div', '', 'hof-window');
    const format = new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    });
    const deadline = element('p', 'Deadline: ');
    const time = element('time', format.format(config.schedule.closesAt));
    time.dateTime = new Date(config.schedule.closesAt).toISOString();
    deadline.append(time);
    notice.append(windowState, deadline);
    form.append(notice);
  }
  const status = element('div', '', 'hof-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  status.tabIndex = -1;
  if (!config.open && !config.schedule) {
    status.textContent = 'Form preview: submissions are not open yet. Nothing you enter will be sent.';
  }
  form.append(status, element('p', 'All fields are required unless marked optional.', 'hof-hint'));
  const about = group(form, 'About you', 'hof-group');
  const aboutGrid = element('div', '', 'hof-grid');
  about.append(aboutGrid);
  const fullName = field(aboutGrid, prefix, 'fullName', 'Full name', {
    autocomplete: 'name', maxLength: 100,
  });
  const email = field(aboutGrid, prefix, 'email', 'Masterclass registration email', {
    type: 'email', autocomplete: 'email', maxLength: 254,
    hint: 'Used to verify attendance and contact you. Not published.',
  });
  const cohort = field(aboutGrid, prefix, 'cohort', 'Masterclass attended', {
    choices: [
      ['', 'Select your Masterclass'],
      ...config.cohorts.map(({ year, city }, index) => [String(index), `${year} - ${city}`]),
    ],
  });
  const siteGroup = group(form, 'Production sites', 'hof-group');
  siteGroup.append(element('p',
    'Add each distinct site once, with its matching URLs and your contribution. Reviewers verify the sites and confirm your level.',
    'hof-hint'));
  siteGroup.append(element('p',
    'Only share information you are authorized to disclose. Do not include credentials, tokens, private source code, or customer data.',
    'hof-hint'));
  const siteList = element('div', '', 'hof-site-list');
  const addButton = element('button', 'Add another site', 'hof-secondary');
  addButton.type = 'button';
  const announcement = element('p', '', 'hof-announcement');
  announcement.setAttribute('aria-live', 'polite');
  siteGroup.append(siteList, addButton, announcement);
  const sites = [];
  let sequence = 0;
  function renumber() {
    validate([...form.querySelectorAll('input, select, textarea')], sites);
    sites.forEach((site, index) => {
      const { productionUrl } = site.fields;
      const hostname = productionUrl.value.trim() && productionUrl.validity.valid
        ? new URL(productionUrl.value.trim()).hostname : '';
      site.title.textContent = `Site ${index + 1}${hostname ? ` - ${hostname}` : ''}`;
      site.state.textContent = Object.values(site.fields).every((control) => control.validity.valid)
        ? 'Ready for review' : 'Needs details';
      site.remove.textContent = `Remove site ${index + 1}`;
      site.remove.disabled = sites.length === 1;
    });
  }
  function openSite(container) {
    sites.forEach((site) => { site.container.open = site.container === container; });
  }
  function addSite(focus = false) {
    sequence += 1;
    const container = element('details', '', 'hof-site');
    container.name = `${prefix}-sites`;
    const summary = element('summary');
    const title = element('span', '', 'hof-site-title');
    const state = element('span', '', 'hof-site-state');
    summary.append(title, state);
    const editor = element('div', '', 'hof-site-editor');
    const grid = element('div', '', 'hof-grid');
    editor.append(grid);
    container.append(summary, editor);
    siteList.append(container);
    const sitePrefix = `${prefix}-site-${sequence}`;
    const fields = {
      productionUrl: field(grid, sitePrefix, 'productionUrl', 'Production site URL', {
        type: 'url', maxLength: 2048, hint: 'For example, https://www.example.org/.',
      }),
      aemLiveUrl: field(grid, sitePrefix, 'aemLiveUrl', 'Matching .aem.live URL', {
        type: 'url', maxLength: 2048, hint: 'For example, https://main--site--org.aem.live/.',
      }),
      repository: field(grid, sitePrefix, 'repository', 'Repository URL or identifier', {
        maxLength: 500, hint: 'Use an approved project identifier if the repository is private.',
      }),
      repositoryVisibility: field(grid, sitePrefix, 'repositoryVisibility', 'Repository visibility', {
        choices: [['', 'Select visibility'], ['public', 'Public'], ['private', 'Private']],
      }),
      contribution: field(grid, sitePrefix, 'contribution', 'Your contribution to this launch', {
        type: 'textarea', maxLength: 2000,
      }),
    };
    const remove = element('button', '', 'hof-secondary hof-remove');
    remove.type = 'button';
    const site = {
      container, title, state, remove, fields,
    };
    remove.addEventListener('click', () => {
      const index = sites.indexOf(site);
      sites.splice(index, 1);
      container.remove();
      renumber();
      const next = sites[Math.min(index, sites.length - 1)];
      if (next) openSite(next.container);
      (next?.fields.productionUrl || addButton).focus();
      announcement.textContent = `Site removed. ${sites.length} remaining.`;
    });
    editor.append(remove);
    sites.push(site);
    renumber();
    openSite(container);
    if (focus) {
      fields.productionUrl.focus();
      announcement.textContent = `Site ${sites.length} added.`;
    }
  }
  addSite();
  addButton.addEventListener('click', () => addSite(true));

  const permissions = group(form, 'Consent', 'hof-group');
  const consent = permission(permissions, prefix, 'consent',
    "I confirm my information is accurate, I'm authorized to share it, and I agree to the review of my nomination.",
    true);
  permissions.append(element('p',
    'Nothing will be published without your final profile approval.',
    'hof-hint'));
  const submit = element('button', 'Submit nomination', 'hof-submit');
  submit.type = 'submit';
  form.append(submit);
  let submitting = false;
  let finished = false;
  let timer;
  function refreshWindow() {
    clearTimeout(timer);
    const now = Date.now();
    const { schedule } = config;
    const accepting = config.open
      && (!schedule || (now >= schedule.opensAt && now < schedule.closesAt));
    submit.disabled = submitting || !accepting;
    if (schedule) {
      let message;
      if (!config.open) message = 'Nominations are paused.';
      else if (now < schedule.opensAt) message = 'Nominations have not opened yet.';
      else if (now >= schedule.closesAt) message = 'Nominations are closed.';
      else {
        const remaining = schedule.closesAt - now;
        const days = Math.ceil(remaining / 86400000);
        const countdown = remaining < 86400000
          ? 'Less than 24 hours left' : `${days} ${days === 1 ? 'day' : 'days'} left`;
        message = `Nominations are open \u00b7 ${countdown}`;
      }
      if (windowState.textContent !== message) windowState.textContent = message;
      if (config.open && now < schedule.closesAt) {
        const boundary = now < schedule.opensAt ? schedule.opensAt : schedule.closesAt;
        timer = setTimeout(() => {
          if (form.isConnected) refreshWindow();
        }, Math.min(60000, boundary - now));
      }
    }
    return accepting;
  }
  form.addEventListener('input', renumber);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!refreshWindow()) {
      status.textContent = `${config.schedule ? windowState.textContent : 'Submissions are not open yet.'} Nothing has been sent.`;
      status.focus();
      return;
    }
    const controls = [...form.querySelectorAll('input, select, textarea')];
    validate(controls, sites);
    const invalid = controls.find((control) => !control.validity.valid);
    if (invalid) {
      const site = invalid.closest('.hof-site');
      if (site) openSite(site);
      invalid.reportValidity();
      return;
    }
    const attended = config.cohorts[Number(cohort.value)];
    const body = new URLSearchParams({
      schemaVersion: '1',
      formType: 'hof-nomination',
      submissionId,
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      attendanceYear: attended.year,
      attendanceCity: attended.city,
      recognitionYear: config.recognitionYear,
      consent: String(consent.checked),
      sites: JSON.stringify(sites.map(({ fields }) => {
        const productionUrl = publicUrl(fields.productionUrl.value.trim()).href;
        const aemLiveUrl = publicUrl(fields.aemLiveUrl.value.trim());
        return {
          productionUrl,
          aemLiveUrl: aemLiveUrl.href,
          ...aemProject(aemLiveUrl),
          repository: fields.repository.value.trim(),
          repositoryVisibility: fields.repositoryVisibility.value,
          contribution: fields.contribution.value.trim(),
        };
      })),
    });
    submitting = true;
    form.setAttribute('aria-busy', 'true');
    form.querySelectorAll('fieldset').forEach((fieldset) => { fieldset.disabled = true; });
    submit.disabled = true;
    submit.textContent = 'Sending nomination...';
    status.textContent = '';
    status.classList.remove('hof-error');
    try {
      const response = await fetch(config.submitUrl, {
        method: 'POST',
        body,
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        redirect: 'error',
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const receipt = await response.json();
      if (receipt?.success !== true || receipt.submissionId !== submissionId) {
        throw new Error('Missing matching nomination receipt');
      }
      const success = element('div', '', 'hof-success');
      const heading = element('h3', 'Nomination received');
      heading.tabIndex = -1;
      success.append(heading, element('p',
        'Your nomination has been received for review. Verification and selection are still pending.'),
      element('p', `Reference: ${submissionId}`, 'hof-hint'));
      finished = true;
      clearTimeout(timer);
      form.replaceChildren(success);
      heading.focus();
    } catch (error) {
      console.error('Hall of Fame nomination receipt could not be confirmed.', error.name);
      status.classList.add('hof-error');
      status.textContent = `We couldn't confirm receipt. Your entries are still here. Please try again later. Reference: ${submissionId}`;
      form.querySelectorAll('fieldset').forEach((fieldset) => { fieldset.disabled = false; });
      renumber();
      submit.textContent = 'Submit nomination';
      status.focus();
    } finally {
      submitting = false;
      form.setAttribute('aria-busy', 'false');
      if (!finished) refreshWindow();
    }
  });
  refreshWindow();
  return form;
}

export default function decorate(block) {
  let config;
  try {
    config = readConfig(block);
  } catch (error) {
    console.error('Invalid Hall of Fame nomination configuration.', error.message);
    const message = element('p',
      'The nomination form is unavailable because its configuration needs attention.',
      'hof-status hof-error');
    message.setAttribute('role', 'alert');
    block.replaceChildren(message);
    return;
  }
  block.replaceChildren(createForm(config));
}
