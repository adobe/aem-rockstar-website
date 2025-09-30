export default function decorate(block) {
  // Create inner container for proper max-width and centering
  const ctaBandInner = document.createElement('div');
  ctaBandInner.className = 'cta-band-inner';

  const rows = [...block.children];

  rows.forEach((row, index) => {
    const cells = [...row.children];

    cells.forEach((cell) => {
      const content = cell.textContent.trim();
      if (!content) return;

      // Row 0: Heading
      if (index === 0) {
        const h2 = document.createElement('h2');
        h2.textContent = content;
        ctaBandInner.appendChild(h2);
      } else if (index === 1) {
      // Row 1: Description paragraph
        const p = document.createElement('p');
        p.textContent = content;
        ctaBandInner.appendChild(p);
      } else if (index === 2) {
      // Row 2: CTA buttons
        // Create CTA row container on first button
        let ctaRow = ctaBandInner.querySelector('.cta-row');
        if (!ctaRow) {
          ctaRow = document.createElement('div');
          ctaRow.className = 'cta-row';
          ctaBandInner.appendChild(ctaRow);
        }

        // Process links in this cell
        const links = cell.querySelectorAll('a');
        links.forEach((link, linkIndex) => {
          const clonedLink = link.cloneNode(true);
          clonedLink.className = `btn ${linkIndex === 0 ? 'primary' : 'secondary'}`;
          // Open external links in new tab, keep anchor links on same page
          const href = clonedLink.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('/') && !href.includes(window.location.hostname)) {
            clonedLink.setAttribute('target', '_blank');
            clonedLink.setAttribute('rel', 'noopener noreferrer');
          }
          ctaRow.appendChild(clonedLink);
        });
      }
    });
  });

  // Replace block content with inner container
  block.replaceChildren(ctaBandInner);
}
