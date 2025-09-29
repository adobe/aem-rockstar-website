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
      }
      // Row 1: Description paragraph
      else if (index === 1) {
        const p = document.createElement('p');
        p.textContent = content;
        ctaBandInner.appendChild(p);
      }
      // Row 2: CTA buttons
      else if (index === 2) {
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
          link.className = `btn ${linkIndex === 0 ? 'primary' : 'secondary'}`;
          ctaRow.appendChild(link.cloneNode(true));
        });
      }
    });
  });

  // Replace block content with inner container
  block.replaceChildren(ctaBandInner);
}
