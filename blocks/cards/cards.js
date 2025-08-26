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
  ul.querySelectorAll('img').forEach((img) => {
    const picture = img.parentElement;
    
    // Function to set aspect ratio and handle loading
    const setAspectRatio = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      
      if (width && height) {
        // Use aspect-ratio CSS property instead of padding-bottom
        picture.style.aspectRatio = `${width}/${height}`;
      }
      
      // Add loaded class for opacity transition
      img.classList.add('loaded');
    };
    
    // If image is already loaded, set aspect ratio immediately
    if (img.complete && img.naturalWidth !== 0) {
      setAspectRatio();
    } else {
      // Otherwise, wait for image to load
      img.addEventListener('load', setAspectRatio);
      img.addEventListener('error', () => {
        // Keep default aspect ratio on error and show image
        img.classList.add('loaded');
      });
    }
    
    // Add loading="lazy" to prevent unnecessary CLS from off-screen images
    img.setAttribute('loading', 'lazy');
  });
  block.textContent = '';
  block.append(ul);
  makeAccessible(block);
}
