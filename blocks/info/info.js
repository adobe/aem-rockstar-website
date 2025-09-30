export default async function decorate(block) {
  // Create wrapper for news-wrapper and info-wrapper elements after block is processed
  const section = block.closest('.section');
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
