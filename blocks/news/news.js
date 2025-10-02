import { readBlockConfig } from '../../scripts/aem.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const rawDate = config.date; // format: 11/12/25

  // Parse and format the date
  const dateObj = new Date(rawDate);
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = monthNames[dateObj.getMonth()];
  const day = dateObj.getDate();

  const contentElements = block.querySelectorAll('div:last-of-type > div:last-of-type > p');
  const content = Array.from(contentElements).map(p => p.outerHTML).join('');
  const { headline } = config;
  const newsContainer = document.createElement('div');
  const topRow = document.createElement('div');
  topRow.classList.add('top-row');
  const dateItem = document.createElement('div');
  dateItem.classList.add('date-item');
  dateItem.innerHTML = `
        <div class="date-month">${month}</div>
        <div class="date-day">${day}</div>
    `;
  topRow.appendChild(dateItem);
  const headlineItem = document.createElement('div');
  headlineItem.classList.add('headline-item');
  const headlineElement = document.createElement('h3');
  headlineElement.innerHTML = headline;
  headlineItem.appendChild(headlineElement);
  topRow.appendChild(headlineItem);
  newsContainer.appendChild(topRow);
  newsContainer.classList.add('news-container');
  const bottomRow = document.createElement('div');
  bottomRow.classList.add('bot-row');
  bottomRow.innerHTML = content;
  newsContainer.appendChild(bottomRow);
  block.replaceWith(newsContainer);

  // Create wrapper for news-wrapper and info-wrapper elements after block is processed
  const section = newsContainer.closest('.section');
  if (section) {
    const defaultContentWrapper = section.querySelector('.default-content-wrapper');
    const existingWrapper = section.querySelector('.block-group-wrapper');
    const targetWrappers = section.querySelectorAll('.news-wrapper, .info-wrapper');

    // Only create wrapper if it doesn't exist and there are target wrappers
    if (targetWrappers.length > 0 && defaultContentWrapper && !existingWrapper) {
      const blockGroupWrapper = document.createElement('div');
      blockGroupWrapper.classList.add('block-group-wrapper');

      targetWrappers.forEach((wrapper) => {
        blockGroupWrapper.appendChild(wrapper);
      });

      // Insert after default-content-wrapper
      defaultContentWrapper.insertAdjacentElement('afterend', blockGroupWrapper);
    }
  }
}
