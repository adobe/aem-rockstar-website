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
//import {
//  buildIcon,
//} from '../../scripts/scripts.js';

function scrollToStart(block) {
  if (block.scrollLeft !== 0) {
    block.scrollLeft = 0;
    const leftNav = block.querySelector('.carousel-nav-left');
    leftNav.classList.add('carousel-nav-disabled');
    const rightNav = block.querySelector('.carousel-nav-right');
    rightNav.classList.remove('carousel-nav-disabled');
  }
}

function checkScrollPosition(el) {
  if (el.scrollLeft === 0) return 'start';
  if (el.scrollWidth - el.scrollLeft === el.offsetWidth) return 'end';
  return null;
}

function buildNav(dir) {
  const btn = document.createElement('aside');
  btn.classList.add('carousel-nav', `carousel-nav-${dir}`);
  if (dir === 'left') btn.classList.add('carousel-nav-disabled'); // start at beginning, can't scroll left
  const arrow = document.createElement('span');
  arrow.innerHTML = '+';
  btn.append(arrow);
  btn.addEventListener('click', (e) => {
    const target = e.target.closest('.carousel-nav');
    if (![...target.classList].includes('carousel-nav-disabled')) {
      const carousel = e.target.closest('.winners-carousel');
      carousel.querySelectorAll('.carousel-nav').forEach((nav) => nav.classList.remove('carousel-nav-disabled'));
      if (dir === 'left') {
        carousel.scrollLeft -= carousel.offsetWidth;
      } else {
        carousel.scrollLeft += carousel.offsetWidth;
      }
      setTimeout(() => {
        const position = checkScrollPosition(carousel);
        if ((position === 'start' && dir === 'left')
          || (position === 'end' && dir === 'right')) {
          btn.classList.add('carousel-nav-disabled');
        } else {
          btn.classList.remove('carousel-nav-disabled');
        }
      }, 750);
    }
  });
  return btn;
}

/**
 * loads and decorates the carousel block
 * @param {Element} block The carousel block element
 */
export default async function decorate(block) {
  const slides = [...block.children];
  slides.forEach((slide) => {
    slide.classList.add('carousel-slide');
    slide.classList.add('carousel-slide-card');
    
    const slideContent = document.createElement('div');
    slideContent.classList.add('carousel-slide-card-content');

    [...slide.children].forEach((child) => {
      if(child.querySelector('picture')) {
        child.classList.add('carousel-slide-card-image');
      } else {
        slideContent.appendChild(child);
      }
    });

    slide.appendChild(slideContent);
   
  });

  // setup for multiple slides
  if (slides.length > 1) {
    const leftBtn = buildNav('left');
    const rightBtn = buildNav('right');
    block.prepend(leftBtn, rightBtn);
    window.addEventListener('resize', () => {
      scrollToStart(block);
    });
  }
}