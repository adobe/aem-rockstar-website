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
  // Optimize images to prevent CLS
  ul.querySelectorAll('img').forEach((img, index) => {
    // First image loads eagerly for LCP, rest are lazy
    if (index === 0) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    } else if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add decoding attribute for performance
    img.setAttribute('decoding', 'async');
  });
  block.textContent = '';
  block.append(ul);
  makeAccessible(block);
}
