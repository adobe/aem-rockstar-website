function makeAccessible(block) {
  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    link.setAttribute('tabindex', '0');
    link.setAttribute('role', 'link');
    link.setAttribute('aria-label', link.textContent);
  });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  // Set aspect ratios immediately using AEM-provided dimensions
  ul.querySelectorAll('img').forEach((img) => {
    const picture = img.parentElement;
    
    // Get dimensions from attributes (AEM provides these)
    const width = parseInt(img.getAttribute('width'), 10);
    const height = parseInt(img.getAttribute('height'), 10);
    
    if (width && height && width > 0 && height > 0) {
      // Set aspect ratio on the picture element to prevent CLS
      picture.style.aspectRatio = `${width}/${height}`;
    }
    
    // Add loading attribute if not already present
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Set decode attribute for better performance
    img.setAttribute('decoding', 'async');
  });
  block.textContent = '';
  block.append(ul);
  makeAccessible(block);
}
