function makeAccessible(block) {
  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    link.setAttribute('tabindex', '0');
    link.setAttribute('role', 'link');
    const linkText = link.textContent?.trim();
    link.setAttribute('aria-label', linkText || 'View card details');
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
  // Optimize images for better loading
  ul.querySelectorAll('img').forEach((img) => {
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
