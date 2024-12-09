import { loadCSS } from '../../scripts/aem.js';

let customComponents = [];
const OOTBComponentDecorators = ['file-input', 'wizard', 'modal', 'tnc', 'toggleable-link', 'rating', 'datetime', 'list', 'location'];

export function setCustomComponents(components) {
  customComponents = components;
}

export function getOOTBComponents() {
  return OOTBComponentDecorators;
}

export function getCustomComponents() {
  return customComponents;
}

/**
 * Loads JS and CSS for a block.
 * @param {Element} block The block element
 */
async function loadComponent(componentName, element, fd, container) {
  const status = element.dataset.componentStatus;
  if (status !== 'loading' && status !== 'loaded') {
    element.dataset.componentStatus = 'loading';
    const { blockName } = element.dataset;
    try {
      loadCSS(`${window.hlx.codeBasePath}/blocks/form/components/${componentName}/${componentName}.css`);
      const decorationComplete = new Promise((resolve) => {
        (async () => {
          try {
            const mod = await import(
              `${window.hlx.codeBasePath}/blocks/form/components/${componentName}/${componentName}.js`
            );
            if (mod.default) {
              await mod.default(element, fd, container);
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`failed to load component for ${blockName}`, error);
          }
          resolve();
        })();
      });
      await Promise.all([decorationComplete]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`failed to load component ${blockName}`, error);
    }
    element.dataset.componentStatus = 'loaded';
  }
  return element;
}

/**
 * returns a decorator to decorate the field definition
 *
 * */
export default async function componentDecorator(element, fd, container) {
  const { ':type': type = '', fieldType } = fd;
  if (fieldType === 'file-input') {
    await loadComponent('file', element, fd, container);
  }

  if (type.endsWith('wizard')) {
    await loadComponent('wizard', element, fd, container);
  }

  if (getCustomComponents().includes(type) || getOOTBComponents().includes(type)) {
    await loadComponent(type, element, fd, container);
  }

  return null;
}
