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
 * Simple markdown to HTML converter for basic formatting
 * @param {string} markdown - The markdown text to convert
 * @returns {string} HTML string
 */
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    
    // Code blocks
    .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Unordered lists
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    
    // Line breaks
    .replace(/\n/g, '<br>');
    
  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li>.*?<\/li>)(<br>)*(?=<li>|$)/gs, (match, listItems) => {
    const items = listItems.match(/<li>.*?<\/li>/g);
    if (items && items.length > 1) {
      return '<ul>' + items.join('') + '</ul>';
    }
    return match;
  });
  
  // Clean up single list items
  html = html.replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>');
  
  return html;
}

/**
 * Creates a textarea field with optional markdown preview
 * @param {string} name - Field name
 * @param {string} id - Field ID
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Whether the field is required
 * @param {number} rows - Number of rows
 * @param {boolean} enableMarkdown - Whether to enable markdown preview
 * @returns {HTMLTextAreaElement|Object} Textarea element or object with textarea and preview
 */
function createTextArea(name, id, placeholder = '', required = false, rows = 4, enableMarkdown = false) {
  const textarea = document.createElement('textarea');
  textarea.name = name;
  textarea.id = id;
  textarea.placeholder = placeholder;
  textarea.required = required;
  textarea.rows = rows;
  
  if (!enableMarkdown) {
    return textarea;
  }
  
  // Create container for markdown editor
  const container = document.createElement('div');
  container.className = 'markdown-editor-container';
  
  // Create tab buttons
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'markdown-tabs';
  
  const editTab = document.createElement('button');
  editTab.type = 'button';
  editTab.textContent = 'Write';
  editTab.className = 'markdown-tab active';
  editTab.dataset.tab = 'edit';
  
  const previewTab = document.createElement('button');
  previewTab.type = 'button';
  previewTab.textContent = 'Preview';
  previewTab.className = 'markdown-tab';
  previewTab.dataset.tab = 'preview';
  
  tabsContainer.appendChild(editTab);
  tabsContainer.appendChild(previewTab);
  
  // Create preview container
  const previewContainer = document.createElement('div');
  previewContainer.className = 'markdown-preview';
  previewContainer.style.display = 'none';
  
  // Add help text
  const helpText = document.createElement('div');
  helpText.className = 'markdown-help';
  helpText.innerHTML = `
    <small>
      <strong>Markdown supported:</strong> 
      **bold**, *italic*, # headers, [links](url), \`code\`, lists
    </small>
  `;
  
  container.appendChild(tabsContainer);
  container.appendChild(helpText);
  container.appendChild(textarea);
  container.appendChild(previewContainer);
  
  // Tab switching logic
  const switchTab = (activeTab) => {
    if (activeTab === 'edit') {
      editTab.classList.add('active');
      previewTab.classList.remove('active');
      textarea.style.display = 'block';
      previewContainer.style.display = 'none';
    } else {
      editTab.classList.remove('active');
      previewTab.classList.add('active');
      textarea.style.display = 'none';
      previewContainer.style.display = 'block';
      
      // Update preview content
      const markdown = textarea.value;
      const html = markdownToHtml(markdown);
      previewContainer.innerHTML = html || '<em>Nothing to preview</em>';
    }
  };
  
  editTab.addEventListener('click', () => switchTab('edit'));
  previewTab.addEventListener('click', () => switchTab('preview'));
  
  return { textarea, container };
}


/**
 * Generates the form payload for submission
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Form data payload
 */
function generatePayload(form) {
  const payload = {};
  const formData = new FormData(form);
  
  for (const [key, value] of formData.entries()) {
    payload[key] = value;
  }

  // Add timestamp
  payload.timestamp = new Date().toISOString();
  
  return payload;
}

/**
 * Handles form submission
 * @param {HTMLFormElement} form - The form element
 * @param {string} submitUrl - The submission URL
 */
async function handleSubmit(form, submitUrl) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submitButton = form.querySelector('button[type="submit"]');
  
  try {
    form.setAttribute('data-submitting', 'true');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const payload = generatePayload(form);
    
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
      // Show success message
      form.innerHTML = `
        <div class="success-message">
          <h3>Thank you!</h3>
          <p>Your AEM Rockstar idea has been submitted successfully. We'll review your submission and get back to you soon.</p>
        </div>
      `;
    } else {
      throw new Error(`Submission failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Submission error:', error);
    
    // Show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <p>Sorry, there was an error submitting your idea. Please try again later.</p>
    `;
    form.insertBefore(errorDiv, form.firstChild);
  } finally {
    form.setAttribute('data-submitting', 'false');
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Idea';
  }
}

/**
 * Creates the submission form
 * @param {string} submitUrl - The URL to submit the form to
 * @returns {HTMLFormElement} The complete form element
 */
function createSubmissionForm(submitUrl) {
  const form = document.createElement('form');
  form.className = 'submission-form';
  form.dataset.action = submitUrl;

  // Form title
  const title = document.createElement('h2');
  title.textContent = 'Submit Your AEM Rockstar Idea';
  title.className = 'form-title';
  form.appendChild(title);

  const description = document.createElement('p');
  description.textContent = 'Share your innovative ideas for Adobe Experience Manager and help shape the future of digital experiences.';
  description.className = 'form-description';
  form.appendChild(description);

  // Personal Information Section
  const personalSection = document.createElement('fieldset');
  personalSection.innerHTML = '<legend>Personal Information</legend>';
  
  // Name field
  const nameWrapper = createFieldWrapper('text');
  const nameInput = createInput('text', 'name', 'submission-name', 'Your full name', true);
  const nameLabel = createLabel('Full Name', 'submission-name', true);
  nameWrapper.appendChild(nameLabel);
  nameWrapper.appendChild(nameInput);
  personalSection.appendChild(nameWrapper);

  // Email field
  const emailWrapper = createFieldWrapper('email');
  const emailInput = createInput('email', 'email', 'submission-email', 'your.email@company.com', true);
  const emailLabel = createLabel('Email Address', 'submission-email', true);
  emailWrapper.appendChild(emailLabel);
  emailWrapper.appendChild(emailInput);
  personalSection.appendChild(emailWrapper);

  // Company field
  const companyWrapper = createFieldWrapper('text');
  const companyInput = createInput('text', 'company', 'submission-company', 'Your company name');
  const companyLabel = createLabel('Company/Organization', 'submission-company');
  companyWrapper.appendChild(companyLabel);
  companyWrapper.appendChild(companyInput);
  personalSection.appendChild(companyWrapper);

  form.appendChild(personalSection);

  // Idea Information Section
  const ideaSection = document.createElement('fieldset');
  ideaSection.innerHTML = '<legend>Your Idea</legend>';

  // Idea title
  const titleWrapper = createFieldWrapper('text');
  const titleInput = createInput('text', 'idea-title', 'submission-title', 'A catchy title for your idea', true);
  const titleLabel = createLabel('Idea Title', 'submission-title', true);
  titleWrapper.appendChild(titleLabel);
  titleWrapper.appendChild(titleInput);
  ideaSection.appendChild(titleWrapper);


  // Idea description with markdown support
  const descriptionWrapper = createFieldWrapper('textarea', 'markdown-wrapper');
  const descriptionResult = createTextArea('description', 'submission-description', 'Describe your idea in detail. What problem does it solve? How would it work?\n\nYou can use **markdown** formatting here!', true, 8, true);
  const descriptionLabel = createLabel('Detailed Description', 'submission-description', true);
  descriptionWrapper.appendChild(descriptionLabel);
  descriptionWrapper.appendChild(descriptionResult.container);
  ideaSection.appendChild(descriptionWrapper);

  // Use case
  const useCaseWrapper = createFieldWrapper('textarea');
  const useCaseTextArea = createTextArea('use-case', 'submission-use-case', 'Describe specific use cases where this idea would be valuable', false, 4);
  const useCaseLabel = createLabel('Use Cases', 'submission-use-case');
  useCaseWrapper.appendChild(useCaseLabel);
  useCaseWrapper.appendChild(useCaseTextArea);
  ideaSection.appendChild(useCaseWrapper);

  // Technical details
  const technicalWrapper = createFieldWrapper('textarea');
  const technicalTextArea = createTextArea('technical-details', 'submission-technical', 'Any technical considerations, requirements, or implementation notes', false, 4);
  const technicalLabel = createLabel('Technical Details (Optional)', 'submission-technical');
  technicalWrapper.appendChild(technicalLabel);
  technicalWrapper.appendChild(technicalTextArea);
  ideaSection.appendChild(technicalWrapper);

  form.appendChild(ideaSection);

  // Submit button
  const submitWrapper = createFieldWrapper('submit');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit Idea';
  submitButton.className = 'button primary';
  submitWrapper.appendChild(submitButton);
  form.appendChild(submitWrapper);

  return form;
}

/**
 * Decorates the submission block
 * @param {Element} block - The block element
 */
export default async function decorate(block) {
  // Use test n8n webhook endpoint
  const submitUrl = 'https://dkuntze.app.n8n.cloud/webhook-test/828ff9cd-e9bf-4bc8-8f13-3fe84012a2cb';

  // Create the form
  const form = createSubmissionForm(submitUrl);
  
  // Replace block content with the form
  block.replaceChildren(form);

  // Add form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.checkValidity();
    
    if (valid) {
      handleSubmit(form, submitUrl);
    } else {
      // Focus on first invalid field
      const firstInvalidField = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}
