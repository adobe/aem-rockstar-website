/**
 * MC Confirm Block
 * An email confirmation form (Accept / Decline) that submits to an n8n webhook
 * Configuration supports two formats:
 *
 * Position-based (rows in order):
 *   Row 1: Webhook URL
 *   Row 2: (Optional) Form title
 *   Row 3: (Optional) Form description
 *   Row 4: (Optional) did (document id)
 *   Row 5: (Optional) sid (sheet id)
 *
 * Key-value (per-row key | value or "key: value"):
 *   submitUrl / webhookUrl, title, description, did, sid
 *   (did = document id, sid = sheet id; obfuscated from FE user, sent in payload only)
 */

/** Message shown when a personal / free email address is used */
const PERSONAL_EMAIL_MESSAGE = 'We recommend using your corporate email address. '
  + 'If you continue with a personal email, please explain why below.';

/** Common personal / free email providers (require an exception explanation) */
const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'zoho.com',
];

/**
 * Extracts the lowercased domain portion of an email address
 * @param {string} email - The email address
 * @returns {string} The domain, or an empty string if none is present
 */
function getEmailDomain(email) {
  const parts = (email || '').trim().toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : '';
}

/**
 * Checks whether an email address uses a known personal / free email provider
 * @param {string} email - The email address to check
 * @returns {boolean} True if the email uses a personal email domain
 */
function isPersonalEmail(email) {
  return PERSONAL_EMAIL_DOMAINS.includes(getEmailDomain(email));
}

/**
 * Creates a field wrapper element
 * @param {string} type - The field type
 * @param {string} className - Additional CSS class
 * @returns {HTMLDivElement} Field wrapper element
 */
function createFieldWrapper(type, className = '') {
  const wrapper = document.createElement('div');
  wrapper.className = `field-wrapper ${type}-wrapper ${className}`.trim();
  return wrapper;
}

/**
 * Creates a label element
 * @param {string} text - Label text
 * @param {string} forId - ID of the associated field
 * @param {boolean} required - Whether the field is required
 * @returns {HTMLLabelElement} Label element
 */
function createLabel(text, forId, required = false) {
  const label = document.createElement('label');
  label.textContent = text;
  label.setAttribute('for', forId);
  if (required) {
    label.dataset.required = true;
  }
  return label;
}

/**
 * Creates an input field
 * @param {string} type - Input type
 * @param {string} name - Field name
 * @param {string} id - Field ID
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Whether the field is required
 * @returns {HTMLInputElement} Input element
 */
function createInput(type, name, id, placeholder = '', required = false) {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.id = id;
  input.placeholder = placeholder;
  input.required = required;
  return input;
}

/**
 * Creates a textarea field
 * @param {string} name - Field name
 * @param {string} id - Field ID
 * @param {string} placeholder - Placeholder text
 * @param {number} rows - Number of visible text rows
 * @returns {HTMLTextAreaElement} Textarea element
 */
function createTextarea(name, id, placeholder = '', rows = 3) {
  const textarea = document.createElement('textarea');
  textarea.name = name;
  textarea.id = id;
  textarea.placeholder = placeholder;
  textarea.rows = rows;
  return textarea;
}

/**
 * Generates the form payload for submission
 * @param {HTMLFormElement} form - The form element
 * @param {string} decision - "accept" or "decline"
 * @param {Object} config - Config with did, sid (obfuscated, not exposed in DOM)
 * @returns {Object} Form data payload
 */
function generatePayload(form, decision, config) {
  const payload = {};
  const formData = new FormData(form);

  Array.from(formData.entries()).forEach(([key, value]) => {
    payload[key] = value;
  });

  payload.decision = decision;
  payload.timestamp = new Date().toISOString();
  if (config.did) payload.did = config.did;
  if (config.sid) payload.sid = config.sid;

  return payload;
}

/**
 * Attempts to parse a fetch Response body as JSON
 * @param {Response} response - The fetch response
 * @returns {Promise<Object|null>} Parsed JSON body, or null if not JSON/empty
 */
async function parseResponseBody(response) {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Handles form submission
 * @param {HTMLFormElement} form - The form element
 * @param {string} decision - "accept" or "decline"
 * @param {string} submitUrl - The submission URL
 * @param {Object} config - Config with did, sid (obfuscated, not exposed in DOM)
 */
async function handleSubmit(form, decision, submitUrl, config) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const acceptButton = form.querySelector('button[data-decision="accept"]');
  const declineButton = form.querySelector('button[data-decision="decline"]');
  let isSuccess = false;

  try {
    form.setAttribute('data-submitting', 'true');
    acceptButton.disabled = true;
    declineButton.disabled = true;

    const payload = generatePayload(form, decision, config);

    // Create form-encoded data to avoid CORS preflight request
    const formData = new URLSearchParams();

    // Add all form fields as individual parameters
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value || '');
    });

    const response = await fetch(submitUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // n8n may respond with a JSON body (e.g. { status, message }) describing
    // the outcome of the lookup/update; fall back to a generic message if not.
    const responseBody = await parseResponseBody(response);

    if (response.ok) {
      isSuccess = true;
      const defaultMessage = decision === 'accept'
        ? 'Thank you! Your acceptance has been recorded.'
        : 'Thank you for letting us know. Your response has been recorded.';
      const message = responseBody?.message || defaultMessage;
      form.innerHTML = `
        <div class="success-message">
          <h3>Response Submitted</h3>
          <p>${message}</p>
        </div>
      `;
    } else {
      const message = responseBody?.message
        || `Submission failed with status: ${response.status}`;
      throw new Error(message);
    }
  } catch (error) {
    // Show error message
    const existingError = form.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    const message = error.message || 'Sorry, there was an error processing your response. Please try again later.';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<p>${message}</p>`;
    form.insertBefore(errorDiv, form.firstChild);
  } finally {
    if (!isSuccess) {
      form.setAttribute('data-submitting', 'false');
      acceptButton.disabled = false;
      declineButton.disabled = false;
    }
  }
}

/**
 * Creates the confirmation form
 * @param {Object} config - Configuration object
 * @param {string} config.submitUrl - The URL to submit the form to
 * @param {string} config.title - Form title
 * @param {string} config.description - Form description
 * @returns {HTMLFormElement} The complete form element
 */
function createConfirmForm(config) {
  const {
    submitUrl,
    title = 'Confirm your response',
    description = '',
  } = config;

  const form = document.createElement('form');
  form.className = 'mc-confirm-form';
  form.dataset.action = submitUrl;

  // Form header
  const header = document.createElement('div');
  header.className = 'form-header';

  const formTitle = document.createElement('h2');
  formTitle.textContent = title;
  formTitle.className = 'form-title';
  header.appendChild(formTitle);

  if (description) {
    const formDescription = document.createElement('div');
    // description may contain rich text markup (links, bold, lists, etc.)
    formDescription.innerHTML = description;
    formDescription.className = 'form-description';
    header.appendChild(formDescription);
  }

  form.appendChild(header);

  // Form fields container
  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'form-fields';

  // Email field
  const emailWrapper = createFieldWrapper('email');
  const emailInput = createInput('email', 'email', 'mc-confirm-email', 'your.email@company.com', true);
  const emailLabel = createLabel('Email Address', 'mc-confirm-email', true);
  emailWrapper.appendChild(emailLabel);
  emailWrapper.appendChild(emailInput);

  // Inline warning message (e.g. personal email discouraged)
  const emailWarning = document.createElement('p');
  emailWarning.className = 'field-error is-hidden';
  emailWarning.id = 'mc-confirm-email-warning';
  emailWarning.setAttribute('role', 'alert');
  emailWrapper.appendChild(emailWarning);

  emailInput.setAttribute('aria-describedby', emailWarning.id);
  fieldsContainer.appendChild(emailWrapper);

  // Email exception field: required justification when a personal email is used
  const emailExceptionWrapper = createFieldWrapper('textarea', 'email-exception-wrapper is-hidden');
  const emailExceptionInput = createTextarea(
    'emailException',
    'mc-confirm-email-exception',
    'Explain why you\'re using a personal email address',
    5,
  );
  emailExceptionInput.disabled = true;
  const emailExceptionLabel = createLabel(
    'Email Exception',
    'mc-confirm-email-exception',
  );
  emailExceptionWrapper.appendChild(emailExceptionLabel);
  emailExceptionWrapper.appendChild(emailExceptionInput);
  fieldsContainer.appendChild(emailExceptionWrapper);

  const validateEmailDomain = () => {
    const usesPersonalEmail = isPersonalEmail(emailInput.value);

    emailWarning.textContent = usesPersonalEmail ? PERSONAL_EMAIL_MESSAGE : '';
    emailWarning.classList.toggle('is-hidden', !usesPersonalEmail);

    emailExceptionWrapper.classList.toggle('is-hidden', !usesPersonalEmail);
    emailExceptionInput.disabled = !usesPersonalEmail;
    emailExceptionInput.required = usesPersonalEmail;
    if (!usesPersonalEmail) {
      emailExceptionInput.value = '';
    }
  };

  emailInput.addEventListener('input', validateEmailDomain);
  emailInput.addEventListener('blur', validateEmailDomain);

  form.appendChild(fieldsContainer);

  // Accept / Decline buttons
  const actionsWrapper = createFieldWrapper('actions');

  const acceptButton = document.createElement('button');
  acceptButton.type = 'submit';
  acceptButton.dataset.decision = 'accept';
  acceptButton.textContent = 'Accept';
  acceptButton.className = 'button primary';

  const declineButton = document.createElement('button');
  declineButton.type = 'submit';
  declineButton.dataset.decision = 'decline';
  declineButton.textContent = 'Decline';
  declineButton.className = 'button secondary';

  actionsWrapper.appendChild(acceptButton);
  actionsWrapper.appendChild(declineButton);
  form.appendChild(actionsWrapper);

  return form;
}

/** Known config keys for key-value format (case-insensitive) */
const CONFIG_KEYS = ['submiturl', 'webhookurl', 'title', 'description', 'did', 'sid'];

/** Maps key variations to config property names */
const KEY_TO_PROP = {
  submiturl: 'submitUrl',
  webhookurl: 'submitUrl',
  title: 'title',
  description: 'description',
  did: 'did',
  sid: 'sid',
};

/**
 * Parses config from key-value format (rows with key in cell 0, value in cell 1)
 * @param {Element[]} rows - Block row elements
 * @returns {Object|null} Parsed config or null if not key-value format
 */
function parseKeyValueConfig(rows) {
  if (rows.length === 0) return null;

  const config = {
    submitUrl: '',
    title: 'Confirm your response',
    description: '',
    did: '',
    sid: '',
  };

  rows.forEach((row) => {
    const cellEls = [...row.children];
    if (cellEls.length >= 2) {
      const key = cellEls[0].textContent.trim().toLowerCase().replace(/\s+/g, '');
      const prop = KEY_TO_PROP[key];
      if (prop) {
        // Preserve rich text markup (links, bold, lists, etc.) for description
        const value = prop === 'description'
          ? cellEls[1].innerHTML.trim()
          : cellEls[1].textContent.trim();
        if (value) config[prop] = value;
      }
    } else if (cellEls.length === 1) {
      const text = cellEls[0].textContent.trim();
      if (text.includes(':')) {
        const [rawKey, ...rest] = text.split(':');
        const key = rawKey.trim().toLowerCase().replace(/\s+/g, '');
        const value = rest.join(':').trim();
        const prop = KEY_TO_PROP[key];
        if (prop && value) {
          config[prop] = value;
        }
      }
    }
  });

  return config;
}

/**
 * Parses config from position-based format
 * Row 0: Webhook URL, 1: Title (opt), 2: Description (opt), 3: did (opt), 4: sid (opt)
 * @param {Element[]} rows - Block row elements
 * @returns {Object} Configuration object
 */
function parsePositionBasedConfig(rows) {
  const config = {
    submitUrl: '',
    title: 'Confirm your response',
    description: '',
    did: '',
    sid: '',
  };

  rows.forEach((row, index) => {
    const cell = row.children[0] ?? row;
    // Preserve rich text markup (links, bold, lists, etc.) for description
    const content = (index === 2 ? cell.innerHTML : cell.textContent).trim();
    switch (index) {
      case 0:
        config.submitUrl = content;
        break;
      case 1:
        if (content) config.title = content;
        break;
      case 2:
        if (content) config.description = content;
        break;
      case 3:
        if (content) config.did = content;
        break;
      case 4:
        if (content) config.sid = content;
        break;
      default:
        break;
    }
  });

  return config;
}

/**
 * Detects whether block content is key-value format
 * @param {Element[]} rows - Block row elements
 * @returns {boolean}
 */
function isKeyValueFormat(rows) {
  if (rows.length === 0) return false;
  const firstRow = rows[0];
  const cells = [...firstRow.children];
  if (cells.length >= 2) return true;
  const content = (cells[0]?.textContent ?? firstRow.textContent ?? '').trim();
  const firstPart = content.split(':')[0]?.trim().toLowerCase().replace(/\s+/g, '') ?? '';
  return CONFIG_KEYS.includes(firstPart);
}

/**
 * Extracts configuration from block content.
 * Supports two formats:
 * 1. Position-based: Row 0=Webhook URL, 1=Title, 2=Description, 3=did, 4=sid
 * 2. Key-value: Rows with key|value cells (e.g. submitUrl|url, title|Confirm)
 *    or "key: value" in a cell
 * @param {Element} block - The block element
 * @returns {Object} Configuration object
 */
function extractConfig(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length === 0) {
    return {
      submitUrl: '',
      title: 'Confirm your response',
      description: '',
      did: '',
      sid: '',
    };
  }

  if (isKeyValueFormat(rows)) {
    return parseKeyValueConfig(rows);
  }
  return parsePositionBasedConfig(rows);
}

/**
 * Decorates the mc-confirm block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  // Extract configuration from block content
  const config = extractConfig(block);

  // Validate required configuration
  if (!config.submitUrl) {
    block.innerHTML = '<p class="error-message">Error: Webhook URL is required. Please configure the block with a valid n8n webhook URL.</p>';
    return;
  }

  // Create the form
  const form = createConfirmForm(config);

  // Replace block content with the form
  block.replaceChildren(form);

  // Add form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const decision = e.submitter?.dataset.decision;
    const valid = form.checkValidity();

    if (valid) {
      handleSubmit(form, decision, config.submitUrl, config);
    } else {
      const firstInvalidField = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}
