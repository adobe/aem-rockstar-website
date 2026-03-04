/**
 * MC Register Block
 * A registration form that submits to an n8n webhook
 * Configuration supports two formats:
 *
 * Position-based (rows in order):
 *   Row 1: Webhook URL
 *   Row 2: Location name
 *   Row 3: Event address/venue
 *   Row 4: (Optional) Form title
 *   Row 5: (Optional) Form description
 *   Row 6: (Optional) did (document id)
 *   Row 7: (Optional) sid (sheet id)
 *
 * Key-value (per-row key | value or "key: value"):
 *   submitUrl / webhookUrl, location, address, title, description, did, sid
 *   (did = document id, sid = sheet id; obfuscated from FE user, sent in payload only)
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

/**
 * Creates a textarea field
 * @param {string} name - Field name
 * @param {string} id - Field ID
 * @param {string} placeholder - Placeholder text
 * @param {number} rows - Number of visible rows
 * @returns {HTMLTextAreaElement} Textarea element
 */
function createTextarea(name, id, placeholder = '', rows = 4) {
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
 * @param {Object} config - Config with location, address, did, sid (obfuscated, not exposed in DOM)
 * @returns {Object} Form data payload
 */
function generatePayload(form, config) {
  const payload = {};
  const formData = new FormData(form);

  Array.from(formData.entries()).forEach(([key, value]) => {
    payload[key] = value;
  });

  payload.location = config.location;
  payload.address = config.address;
  payload.timestamp = new Date().toISOString();
  if (config.did) payload.did = config.did;
  if (config.sid) payload.sid = config.sid;

  return payload;
}

/**
 * Handles form submission
 * @param {HTMLFormElement} form - The form element
 * @param {string} submitUrl - The submission URL
 * @param {Object} config - Config with location, address, did, sid (obfuscated, not exposed in DOM)
 */
async function handleSubmit(form, submitUrl, config) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submitButton = form.querySelector('button[type="submit"]');
  let isSuccess = false;

  try {
    form.setAttribute('data-submitting', 'true');
    submitButton.disabled = true;
    submitButton.textContent = 'Registering...';

    const payload = generatePayload(form, config);

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

    if (response.ok) {
      isSuccess = true;
      // Show success message
      form.innerHTML = `
        <div class="success-message">
          <h3>Registration Successful!</h3>
          <p>Thank you for registering. We've received your information and will be in touch soon with further details.</p>
        </div>
      `;
    } else {
      throw new Error(`Registration failed with status: ${response.status}`);
    }
  } catch (error) {
    // Show error message
    const existingError = form.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <p>Sorry, there was an error processing your registration. Please try again later.</p>
    `;
    form.insertBefore(errorDiv, form.firstChild);
  } finally {
    // Only restore button state if submission failed
    if (!isSuccess && submitButton && submitButton.parentNode) {
      form.setAttribute('data-submitting', 'false');
      submitButton.disabled = false;
      submitButton.textContent = 'Register';
    } else if (!isSuccess) {
      form.setAttribute('data-submitting', 'false');
    }
  }
}

/**
 * Creates the registration form
 * @param {Object} config - Configuration object
 * @param {string} config.submitUrl - The URL to submit the form to
 * @param {string} config.location - The location name
 * @param {string} config.address - The event address/venue
 * @param {string} config.title - Form title
 * @param {string} config.description - Form description
 * @returns {HTMLFormElement} The complete form element
 */
function createRegistrationForm(config) {
  const {
    submitUrl,
    location,
    address = '',
    title = 'Register',
    description = '',
  } = config;

  const form = document.createElement('form');
  form.className = 'mc-register-form';
  form.dataset.action = submitUrl;
  form.dataset.location = location;

  // Form header
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

  // Location info container
  const locationInfo = document.createElement('div');
  locationInfo.className = 'location-info';

  // Location badge
  const locationBadge = document.createElement('div');
  locationBadge.className = 'location-badge';
  locationBadge.innerHTML = `<span class="location-icon">📍</span><span class="location-text">${location}</span>`;
  locationInfo.appendChild(locationBadge);

  // Event address
  if (address) {
    const addressElement = document.createElement('p');
    addressElement.className = 'event-address';
    addressElement.textContent = address;
    locationInfo.appendChild(addressElement);
  }

  header.appendChild(locationInfo);

  form.appendChild(header);

  // Form fields container
  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'form-fields';

  // First Name field
  const firstNameWrapper = createFieldWrapper('text');
  const firstNameInput = createInput('text', 'firstName', 'mc-register-firstname', 'First name', true);
  const firstNameLabel = createLabel('First Name', 'mc-register-firstname', true);
  firstNameWrapper.appendChild(firstNameLabel);
  firstNameWrapper.appendChild(firstNameInput);
  fieldsContainer.appendChild(firstNameWrapper);

  // Last Name field
  const lastNameWrapper = createFieldWrapper('text');
  const lastNameInput = createInput('text', 'lastName', 'mc-register-lastname', 'Last name', true);
  const lastNameLabel = createLabel('Last Name', 'mc-register-lastname', true);
  lastNameWrapper.appendChild(lastNameLabel);
  lastNameWrapper.appendChild(lastNameInput);
  fieldsContainer.appendChild(lastNameWrapper);

  // Email field
  const emailWrapper = createFieldWrapper('email');
  const emailInput = createInput('email', 'email', 'mc-register-email', 'your.email@company.com', true);
  const emailLabel = createLabel('Email Address', 'mc-register-email', true);
  emailWrapper.appendChild(emailLabel);
  emailWrapper.appendChild(emailInput);
  fieldsContainer.appendChild(emailWrapper);

  // Company field
  const companyWrapper = createFieldWrapper('text', 'company-wrapper');
  const companyInput = createInput('text', 'company', 'mc-register-company', 'Your company name');
  const companyLabel = createLabel('Company/Organization', 'mc-register-company');
  companyWrapper.appendChild(companyLabel);
  companyWrapper.appendChild(companyInput);
  fieldsContainer.appendChild(companyWrapper);

  // Job Title field
  const jobTitleWrapper = createFieldWrapper('text', 'jobtitle-wrapper');
  const jobTitleInput = createInput('text', 'jobTitle', 'mc-register-jobtitle', 'Your job title');
  const jobTitleLabel = createLabel('Job Title', 'mc-register-jobtitle');
  jobTitleWrapper.appendChild(jobTitleLabel);
  jobTitleWrapper.appendChild(jobTitleInput);
  fieldsContainer.appendChild(jobTitleWrapper);

  // Dietary restrictions field
  const dietaryWrapper = createFieldWrapper('radio', 'dietary-wrapper');
  const dietaryFieldset = document.createElement('fieldset');
  dietaryFieldset.className = 'radio-fieldset';

  const dietaryLegend = document.createElement('legend');
  dietaryLegend.textContent = 'Do you have any dietary restrictions or allergies?';
  dietaryLegend.dataset.required = true;
  dietaryFieldset.appendChild(dietaryLegend);

  const dietaryGroup = document.createElement('div');
  dietaryGroup.className = 'radio-group';

  const dietaryOptions = [
    { value: 'none', label: 'None' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-free' },
    { value: 'other', label: 'Other' },
  ];

  dietaryOptions.forEach(({ value, label }, index) => {
    const optionLabel = document.createElement('label');
    optionLabel.className = 'radio-option';
    optionLabel.setAttribute('for', `mc-register-dietary-${value}`);

    const radio = createInput('radio', 'dietaryRestrictions', `mc-register-dietary-${value}`);
    radio.value = value;
    if (index === 0) {
      radio.required = true;
    }

    const optionText = document.createElement('span');
    optionText.textContent = label;

    optionLabel.appendChild(radio);
    optionLabel.appendChild(optionText);
    dietaryGroup.appendChild(optionLabel);
  });

  dietaryFieldset.appendChild(dietaryGroup);
  dietaryWrapper.appendChild(dietaryFieldset);
  fieldsContainer.appendChild(dietaryWrapper);

  // Dietary "other" details field
  const dietaryOtherWrapper = createFieldWrapper('text', 'dietary-other-wrapper is-hidden');
  const dietaryOtherInput = createInput(
    'text',
    'dietaryRestrictionsOther',
    'mc-register-dietary-other',
    'Please specify',
  );
  dietaryOtherInput.disabled = true;
  const dietaryOtherLabel = createLabel(
    'Please specify your dietary restriction or allergy',
    'mc-register-dietary-other',
  );
  dietaryOtherWrapper.appendChild(dietaryOtherLabel);
  dietaryOtherWrapper.appendChild(dietaryOtherInput);
  fieldsContainer.appendChild(dietaryOtherWrapper);

  const dietaryRadioInputs = dietaryGroup.querySelectorAll('input[type="radio"]');
  const toggleDietaryOtherField = () => {
    const isOtherSelected = Array.from(dietaryRadioInputs).some(
      (radio) => radio.checked && radio.value === 'other',
    );
    dietaryOtherWrapper.classList.toggle('is-hidden', !isOtherSelected);
    dietaryOtherInput.disabled = !isOtherSelected;
    dietaryOtherInput.required = isOtherSelected;
    if (!isOtherSelected) {
      dietaryOtherInput.value = '';
    }
  };

  dietaryRadioInputs.forEach((radio) => {
    radio.addEventListener('change', toggleDietaryOtherField);
  });
  toggleDietaryOtherField();

  // Masterclass expectations field
  const expectationsWrapper = createFieldWrapper('textarea', 'expectations-wrapper');
  const expectationsInput = createTextarea(
    'masterclassExpectations',
    'mc-register-expectations',
    'Share what you hope to get out of Masterclass',
  );
  const expectationsLabel = createLabel(
    'What do you hope to get out of Masterclass?',
    'mc-register-expectations',
  );
  expectationsWrapper.appendChild(expectationsLabel);
  expectationsWrapper.appendChild(expectationsInput);
  fieldsContainer.appendChild(expectationsWrapper);

  form.appendChild(fieldsContainer);

  // Submit button
  const submitWrapper = createFieldWrapper('submit');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Register';
  submitButton.className = 'button primary';
  submitWrapper.appendChild(submitButton);
  form.appendChild(submitWrapper);

  return form;
}

/** Known config keys for key-value format (case-insensitive) */
const CONFIG_KEYS = ['submiturl', 'webhookurl', 'location', 'address', 'title', 'description', 'did', 'sid'];

/** Maps key variations to config property names */
const KEY_TO_PROP = {
  submiturl: 'submitUrl',
  webhookurl: 'submitUrl',
  location: 'location',
  address: 'address',
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
    location: '',
    address: '',
    title: 'Register',
    description: '',
    did: '',
    sid: '',
  };

  for (const row of rows) {
    const cells = [...row.children].map((c) => c.textContent.trim());
    if (cells.length >= 2) {
      const key = cells[0].toLowerCase().replace(/\s+/g, '');
      const value = cells[1];
      const prop = KEY_TO_PROP[key];
      if (prop && value) {
        config[prop] = value;
      }
    } else if (cells.length === 1 && cells[0].includes(':')) {
      const [rawKey, ...rest] = cells[0].split(':');
      const key = rawKey.trim().toLowerCase().replace(/\s+/g, '');
      const value = rest.join(':').trim();
      const prop = KEY_TO_PROP[key];
      if (prop && value) {
        config[prop] = value;
      }
    }
  }

  return config;
}

/**
 * Parses config from position-based format
 * Row 0: Webhook URL, 1: Location, 2: Address, 3: Title (opt), 4: Description (opt), 5: did (opt), 6: sid (opt)
 * @param {Element[]} rows - Block row elements
 * @returns {Object} Configuration object
 */
function parsePositionBasedConfig(rows) {
  const config = {
    submitUrl: '',
    location: '',
    address: '',
    title: 'Register',
    description: '',
    did: '',
    sid: '',
  };

  rows.forEach((row, index) => {
    const content = (row.children[0]?.textContent ?? row.textContent ?? '').trim();
    switch (index) {
      case 0:
        config.submitUrl = content;
        break;
      case 1:
        config.location = content;
        break;
      case 2:
        config.address = content;
        break;
      case 3:
        if (content) config.title = content;
        break;
      case 4:
        if (content) config.description = content;
        break;
      case 5:
        if (content) config.did = content;
        break;
      case 6:
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
 * 1. Position-based: Row 0=Webhook URL, 1=Location, 2=Address, 3=Title, 4=Description, 5=did, 6=sid
 * 2. Key-value: Rows with key|value cells (e.g. submitUrl|url, location|Name) or "key: value" in a cell
 * @param {Element} block - The block element
 * @returns {Object} Configuration object
 */
function extractConfig(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length === 0) return { submitUrl: '', location: '', address: '', title: 'Register', description: '', did: '', sid: '' };

  if (isKeyValueFormat(rows)) {
    return parseKeyValueConfig(rows);
  }
  return parsePositionBasedConfig(rows);
}

/**
 * Decorates the mc-register block
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

  if (!config.location) {
    block.innerHTML = '<p class="error-message">Error: Location is required. Please configure the block with a location name.</p>';
    return;
  }

  // Create the form
  const form = createRegistrationForm(config);

  // Replace block content with the form
  block.replaceChildren(form);

  // Add form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.checkValidity();

    if (valid) {
      handleSubmit(form, config.submitUrl, config);
    } else {
      // Focus on first invalid field
      const firstInvalidField = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}
