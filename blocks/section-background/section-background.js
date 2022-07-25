/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
export default async function decorate(block) {
  const image = block.querySelector('picture img');
  const src = image.getAttribute('src');
  const section = block.closest('.section');
  if (src) {
    section.classList.add('section-background-image');
    if (src.startsWith('./media_') && src.includes('?')) {
      // if the image comes from helix and has params, strip those params
      const modifiedSrc = src.substr(0, src.indexOf('?'));
      section.style.backgroundImage = `url(${modifiedSrc})`;
    } else {
      section.style.backgroundImage = `url(${src})`;
    }
  }

  const allowedAdditiveClasses = ['hero'];
  block.classList.forEach((clz) => {
    if (allowedAdditiveClasses.includes(clz)) {
      section.classList.add(`section-background-${clz}`);
    }
  });

  block.closest('.section-background-wrapper').remove();
}
