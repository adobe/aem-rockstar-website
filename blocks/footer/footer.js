/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';
import { event } from '../../scripts/instrument.js';

function decorateBackToTop(element) {
  const backToTopDiv = document.createElement('div');
  const backToTopButton = document.createElement('button');
  backToTopButton.id = 'back-to-top';

  const text = document.createElement('span');
  text.innerText = 'Back To Top';
  backToTopButton.appendChild(text);

  const arrow = document.createElement('span');
  arrow.classList.add('arrow-up');
  backToTopButton.appendChild(arrow);

  backToTopButton.addEventListener('click', () => {
    window.scrollTo(0, 0);
    event('backToTop', {}, backToTopButton);
  });

  backToTopDiv.append(backToTopButton);
  element.appendChild(backToTopDiv);
}

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;
  footer.classList.add('footer-inner');

  await decorateIcons(footer);

  decorateBackToTop(footer);

  block.append(footer);
}
