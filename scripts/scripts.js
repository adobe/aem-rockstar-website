import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './aem.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Retrieves the content of metadata tags.
 * @param {string} name The metadata name (or property)
 * @returns {string} The metadata value(s)
 */
export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)].map((m) => m.content).join(', ');
  return meta || null;
}

/**
 * Adds one or more URLs to the dependencies for publishing.
 * @param {string|[string]} url The URL(s) to add as dependencies
 */
export function addPublishDependencies(url) {
  const urls = Array.isArray(url) ? url : [url];
  window.hlx = window.hlx || {};
  if (window.hlx.dependencies && Array.isArray(window.hlx.dependencies)) {
    window.hlx.dependencies = window.hlx.dependencies.concat(urls);
  } else {
    window.hlx.dependencies = urls;
  }
}

/**
 * Sanitizes a name for use as class name.
 * @param {string} name The unsanitized name
 * @returns {string} The class name
 */
export function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

/*
 * Sanitizes a name for use as a js property name.
 * @param {string} name The unsanitized name
 * @returns {string} The camelCased name
 */
export function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Gets placeholders object
 * @param {string} prefix
 */
export async function fetchPlaceholders(prefix = 'default') {
  window.placeholders = window.placeholders || {};
  const loaded = window.placeholders[`${prefix}-loaded`];
  if (!loaded) {
    window.placeholders[`${prefix}-loaded`] = new Promise((resolve, reject) => {
      try {
        fetch(`${prefix === 'default' ? '' : prefix}/placeholders.json`)
          .then((resp) => resp.json())
          .then((json) => {
            const placeholders = {};
            json.data.forEach((placeholder) => {
              placeholders[toCamelCase(placeholder.Key)] = placeholder.Text;
            });
            window.placeholders[prefix] = placeholders;
            resolve();
          });
      } catch (error) {
        // error loading placeholders
        window.placeholders[prefix] = {};
        reject();
      }
    });
  }
  await window.placeholders[`${prefix}-loaded`];
  return (window.placeholders[prefix]);
}

/**
 * Decorates a block.
 * @param {Element} block The block element
 */
export function decorateBlock(block) {
  const shortBlockName = block.classList[0];
  if (shortBlockName) {
    block.classList.add('block');
    block.setAttribute('data-block-name', shortBlockName);
    block.setAttribute('data-block-status', 'initialized');
    const blockWrapper = block.parentElement;
    blockWrapper.classList.add(`${shortBlockName}-wrapper`);
    const section = block.closest('.section');
    if (section) section.classList.add(`${shortBlockName}-container`);
  }
}

/**
 * Extracts the config from a block.
 * @param {Element} block The block element
 * @returns {object} The block config
 */
export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope>div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        let value = '';
        if (col.querySelector('a')) {
          const as = [...col.querySelectorAll('a')];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (col.querySelector('img')) {
          const imgs = [...col.querySelectorAll('img')];
          if (imgs.length === 1) {
            value = imgs[0].src;
          } else {
            value = imgs.map((img) => img.src);
          }
        } else if (col.querySelector('p')) {
          const ps = [...col.querySelectorAll('p')];
          if (ps.length === 1) {
            value = ps[0].textContent;
          } else {
            value = ps.map((p) => p.textContent);
          }
        } else value = row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
}

/**
 * Updates all section status in a container element.
 * @param {Element} main The container element
 */
export function updateSectionsStatus(main) {
  const sections = [...main.querySelectorAll(':scope > div.section')];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const status = section.getAttribute('data-section-status');
    if (status !== 'loaded') {
      const loadingBlock = section.querySelector('.block[data-block-status="initialized"], .block[data-block-status="loading"]');
      if (loadingBlock) {
        section.setAttribute('data-section-status', 'loading');
        break;
      } else {
        section.setAttribute('data-section-status', 'loaded');
      }
    }
  }
}

/**
 * Loads JS and CSS for a block.
 * @param {Element} block The block element
 */
export async function loadBlock(block, eager = false) {
  if (!(block.getAttribute('data-block-status') === 'loading' || block.getAttribute('data-block-status') === 'loaded')) {
    block.setAttribute('data-block-status', 'loading');
    const blockName = block.getAttribute('data-block-name');
    try {
      const cssLoaded = new Promise((resolve) => {
        loadCSS(`${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`, resolve);
      });
      const decorationComplete = new Promise((resolve) => {
        (async () => {
          try {
            const mod = await import(`../blocks/${blockName}/${blockName}.js`);
            if (mod.default) {
              await mod.default(block, blockName, document, eager);
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`failed to load module for ${blockName}`, error);
          }
          resolve();
        })();
      });
      await Promise.all([cssLoaded, decorationComplete]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`failed to load block ${blockName}`, error);
    }
    block.setAttribute('data-block-status', 'loaded');
  }
}

/**
 * Returns a picture element with webp and fallbacks
 * @param {string} src The image URL
 * @param {boolean} eager load image eager
 * @param {Array} breakpoints breakpoints and corresponding params (eg. width)
 */
export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 400px)', width: '2000' }, { width: '750' }]) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
    }
  });

  return picture;
}

/**
 * Normalizes all headings within a container element.
 * @param {Element} el The container element
 * @param {[string]} allowedHeadings The list of allowed headings (h1 ... h6)
 */
export function normalizeHeadings(el, allowedHeadings) {
  const allowed = allowedHeadings.map((h) => h.toLowerCase());
  el.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((tag) => {
    const h = tag.tagName.toLowerCase();
    if (allowed.indexOf(h) === -1) {
      // current heading is not in the allowed list -> try first to "promote" the heading
      let level = parseInt(h.charAt(1), 10) - 1;
      while (allowed.indexOf(`h${level}`) === -1 && level > 0) {
        level -= 1;
      }
      if (level === 0) {
        // did not find a match -> try to "downgrade" the heading
        while (allowed.indexOf(`h${level}`) === -1 && level < 7) {
          level += 1;
        }
      }
      if (level !== 7) {
        tag.outerHTML = `<h${level} id="${tag.id}">${tag.textContent}</h${level}>`;
      }
    }
  });
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * Decorates the page.
 */
async function loadPage(doc) {
  // eslint-disable-next-line no-use-before-define
  await loadEager(doc);
  // eslint-disable-next-line no-use-before-define
  await loadLazy(doc);
  // eslint-disable-next-line no-use-before-define
  loadDelayed(doc);
}

export function initHlx() {
  window.hlx = window.hlx || {};
  window.hlx.lighthouse = new URLSearchParams(window.location.search).get('lighthouse') === 'on';
  window.hlx.codeBasePath = '';

  const scriptEl = document.querySelector('script[src$="/scripts/scripts.js"]');
  if (scriptEl) {
    try {
      [window.hlx.codeBasePath] = new URL(scriptEl.src).pathname.split('/scripts/scripts.js');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
}

initHlx();

/*
 * ------------------------------------------------------------
 * Edit above at your own risk
 * ------------------------------------------------------------
 */

sampleRUM('top');
window.addEventListener('load', () => sampleRUM('load'));
document.addEventListener('click', () => sampleRUM('click'));

loadPage(document);

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const h2 = main.querySelector('h2');
  const picture = main.querySelector('picture');
  const containingDiv = h1.closest('div');

  if (h1 && h2 // eslint-disable-next-line no-bitwise
    && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1, h2] }));
    main.prepend(section);
  }

  // the original div these eelments were lifted from is now likely empty, so remove it
  const pars = containingDiv.querySelectorAll('p');
  pars.forEach((par) => {
    if (par.innerText.trim() === '') {
      // remove empty paragraphs from it
      par.remove();
    }
  });

  // if it's now empty, then remove the div
  if (containingDiv.innerHTML.trim() === '') {
    containingDiv.remove();
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}
