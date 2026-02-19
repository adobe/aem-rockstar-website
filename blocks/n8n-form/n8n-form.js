/**
 * N8N Form Block
 * A generic form that submits to an n8n webhook.
 * Configuration is read from the block content:
 *   Row 0: Webhook URL (required)
 *   Row 1: Form title (optional, default "Sign up")
 *   Row 2: Form description (optional, single cell)
 *   Row 3: Thank-you title (optional, single cell, default "Thank you!")
 *   Row 4: Thank-you message (optional, single cell)
 *   First row with 2+ cells: field definitions. Cells: Label | Name | Type | Required | Placeholder
 *   If no field rows are provided, defaults to Name + Email.
 */

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

/** Allowed input types for security */
const ALLOWED_TYPES = ['text', 'email', 'tel', 'number', 'url'];

/**
 * Sanitizes a string for use as HTML name attribute (payload key)
 * @param {string} value - Raw value
 * @param {number} fallbackIndex - Fallback name if invalid
 * @returns {string} Safe name
 */
function safeName(value, fallbackIndex = 0) {
  if (!value || typeof value !== 'string') return `field${fallbackIndex}`;
  const sanitized = value.trim().replace(/[^a-zA-Z0-9_-]/g, '_').replace(/^_+|_+$/g, '') || `field${fallbackIndex}`;
  return sanitized || `field${fallbackIndex}`;
}

/**
 * Parses a field definition from a table row (cells: Label, Name, Type, Required, Placeholder)
 * @param {string[]} cells - Cell text values
 * @param {number} index - Row index for fallback naming
 * @returns {Object|null} Field config or null if row is too short/invalid
 */
function parseFieldRow(cells, index) {
  const label = cells[0]?.trim();
  const nameRaw = cells[1]?.trim();
  if (!label && !nameRaw) return null;
  const name = safeName(nameRaw || label?.toLowerCase().replace(/\s+/g, '_'), index);
  const typeRaw = (cells[2]?.trim() || 'text').toLowerCase();
  const type = ALLOWED_TYPES.includes(typeRaw) ? typeRaw : 'text';
  const requiredStr = (cells[3]?.trim() || 'yes').toLowerCase();
  const required = requiredStr === 'yes' || requiredStr === 'true' || requiredStr === '1';
  const placeholder = cells[4]?.trim() || '';
  return {
    label: label || name, name, type, required, placeholder,
  };
}

/**
 * Generates the form payload for submission
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Form data payload
 */
function generatePayload(form) {
  const payload = {};
  const formData = new FormData(form);

  Array.from(formData.entries()).forEach(([key, value]) => {
    payload[key] = value;
  });

  payload.timestamp = new Date().toISOString();
  return payload;
}

/**
 * Handles form submission
 * @param {HTMLFormElement} form - The form element
 * @param {string} submitUrl - The submission URL
 * @param {Object} successText - Optional { title, message } for the thank you screen
 * @param {string} [bearerToken] - Optional Bearer token; sends Authorization header for n8n.
 */
async function handleSubmit(form, submitUrl, successText = {}, bearerToken = null) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submitButton = form.querySelector('button[type="submit"]');
  let isSuccess = false;
  const successTitle = successText.title || 'Thank you!';
  const successMessage = successText.message || "We've received your information and will be in touch soon.";

  try {
    form.setAttribute('data-submitting', 'true');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const payload = generatePayload(form);

    const formData = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value || '');
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (bearerToken && bearerToken.trim()) {
      headers.Authorization = `Bearer ${bearerToken.trim()}`;
    }

    const response = await fetch(submitUrl, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (response.ok) {
      isSuccess = true;
      form.innerHTML = `
        <div class="success-message">
          <h3>${successTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h3>
          <p>${successMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      `;
    } else {
      throw new Error(`Submission failed with status: ${response.status}`);
    }
  } catch (error) {
    const existingError = form.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <p>Sorry, there was an error. Please try again later.</p>
    `;
    form.insertBefore(errorDiv, form.firstChild);
  } finally {
    if (!isSuccess && submitButton && submitButton.parentNode) {
      form.setAttribute('data-submitting', 'false');
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
    } else if (!isSuccess) {
      form.setAttribute('data-submitting', 'false');
    }
  }
}

/** Default fields when none are configured (name + email) */
const DEFAULT_FIELDS = [
  {
    label: 'Name', name: 'name', type: 'text', required: true, placeholder: 'Your name',
  },
  {
    label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'your@email.com',
  },
];

/**
 * Creates the form from config (configurable title and fields)
 * @param {Object} config - Configuration object
 * @param {string} config.submitUrl - The URL to submit the form to
 * @param {string} config.title - Form title
 * @param {string} config.description - Form description
 * @param {Object[]} config.fields - Array of { label, name, type, required, placeholder }
 * @returns {HTMLFormElement} The complete form element
 */
function createForm(config) {
  const {
    submitUrl,
    title = 'Sign up',
    description = '',
    fields = DEFAULT_FIELDS,
  } = config;

  const form = document.createElement('form');
  form.className = 'n8n-form-form';
  form.dataset.action = submitUrl;

  const header = document.createElement('div');
  header.className = 'form-header';

  const formTitle = document.createElement('h2');
  formTitle.textContent = title;
  formTitle.className = 'form-title';
  header.appendChild(formTitle);

  if (description) {
    const formDescription = document.createElement('p');
    formDescription.textContent = description;
    formDescription.className = 'form-description';
    header.appendChild(formDescription);
  }

  form.appendChild(header);

  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'form-fields';

  fields.forEach((field, index) => {
    const id = `n8n-form-${field.name}-${index}`;
    const wrapper = createFieldWrapper(field.type);
    const input = createInput(field.type, field.name, id, field.placeholder, field.required);
    const label = createLabel(field.label, id, field.required);
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    fieldsContainer.appendChild(wrapper);
  });

  form.appendChild(fieldsContainer);

  const submitWrapper = createFieldWrapper('submit');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit';
  submitButton.className = 'button primary';
  submitWrapper.appendChild(submitButton);
  form.appendChild(submitWrapper);

  return form;
}

/**
 * Extracts configuration from block content.
 * First row may be block name (skipped); then row 0 = URL, 1 = title, 2 = description, 3+ = fields.
 * @param {Element} block - The block element
 * @returns {Object} Configuration object with submitUrl, title, description, fields[]
 */
function extractConfig(block) {
  const rows = [...block.children];
  const blockName = block.dataset.blockName || [...block.classList].find((c) => c !== 'block') || block.classList[0];
  const firstRowFirstCell = rows[0]?.children[0]?.textContent?.trim() ?? '';
  const skipNameRow = blockName && firstRowFirstCell === blockName;
  const dataRows = skipNameRow ? rows.slice(1) : rows;

  const config = {
    submitUrl: '',
    title: 'Sign up',
    description: '',
    successTitle: '',
    successMessage: '',
    fields: [],
    /** Optional. When set, form POST includes Authorization: Bearer <token> for n8n. */
    bearerToken: '',
  };

  if (dataRows.length > 0) {
    config.submitUrl = dataRows[0].children[0]?.textContent?.trim() ?? '';
  }
  if (dataRows.length > 1) {
    const titleCell = dataRows[1].children[0]?.textContent?.trim();
    config.title = titleCell || config.title;
  }

  // Rows 2+: optional single-cell (description, success title/message) or field rows (2+ cells)
  let fieldStartIndex = dataRows.length;
  for (let i = 2; i < dataRows.length; i += 1) {
    if ((dataRows[i].children?.length ?? 0) >= 2) {
      fieldStartIndex = i;
      break;
    }
  }
  let optIndex = 0;
  for (let i = 2; i < fieldStartIndex; i += 1) {
    const val = dataRows[i].children[0]?.textContent?.trim() || '';
    if (optIndex === 0) config.description = val;
    else if (optIndex === 1) config.successTitle = val;
    else if (optIndex === 2) config.successMessage = val;
    optIndex += 1;
  }

  for (let i = fieldStartIndex; i < dataRows.length; i += 1) {
    const cells = [...dataRows[i].children].map((cell) => cell.textContent.trim());
    const field = parseFieldRow(cells, config.fields.length);
    if (field) config.fields.push(field);
  }

  if (config.fields.length === 0) {
    config.fields = DEFAULT_FIELDS;
  }

  // Optional: Bearer token (block data-bearer-token or window.n8nFormBearerToken)
  const win = typeof window !== 'undefined' ? window : null;
  config.bearerToken = block.dataset.bearerToken
    || block.getAttribute('data-bearer-token')
    || (win && win.n8nFormBearerToken)
    || '';

  return config;
}

/**
 * Decorates the n8n-form block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  const config = extractConfig(block);

  if (!config.submitUrl) {
    block.innerHTML = '<p class="error-message">Error: Webhook URL is required. '
      + 'Configure the block with a valid n8n webhook URL.</p>';
    return;
  }

  const form = createForm(config);
  block.replaceChildren(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.checkValidity();

    if (valid) {
      handleSubmit(form, config.submitUrl, {
        title: config.successTitle,
        message: config.successMessage,
      }, config.bearerToken);
    } else {
      const firstInvalidField = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}
