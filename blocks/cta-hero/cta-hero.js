import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Create cta-hero structure
  const ctaHeroInner = document.createElement('div');
  ctaHeroInner.className = 'cta-hero-inner';

  // Create headline section (we'll always need this for text content)
  const headline = document.createElement('div');
  headline.className = 'headline';

  let logoWrap;

  // Process hero content table structure
  const rows = [...block.children];
  
  rows.forEach((row, rowIndex) => {
    const cells = [...row.children];
    
    cells.forEach((cell, cellIndex) => {
      const content = cell.textContent.trim();
      
      // Row 0: Badges (each cell is a badge)
      if (rowIndex === 0 && content) {
        if (cellIndex === 0) {
          // Create badges container on first cell
          const badges = document.createElement('div');
          badges.className = 'badges';
          headline.appendChild(badges);
        }
        
        // Add each cell as a badge
        const badges = headline.querySelector('.badges');
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = content;
        badges.appendChild(badge);
      }
      // Row 1: Kicker text
      else if (rowIndex === 1 && content) {
        const kicker = document.createElement('p');
        kicker.className = 'kicker';
        kicker.textContent = content;
        headline.appendChild(kicker);
      }
      // Row 2: Main headline
      else if (rowIndex === 2 && content) {
        const h1 = document.createElement('h1');
        h1.textContent = content;
        headline.appendChild(h1);
      }
      // Row 3: Description paragraph
      else if (rowIndex === 3 && content) {
        const p = document.createElement('p');
        p.innerHTML = cell.innerHTML;
        headline.appendChild(p);
      }
      // Row 4: CTA buttons (each cell is a button)
      else if (rowIndex === 4) {
        const link = cell.querySelector('a');
        if (link) {
          if (cellIndex === 0) {
            // Create CTA container on first cell
            const ctaRow = document.createElement('div');
            ctaRow.className = 'cta-row';
            headline.appendChild(ctaRow);
          }
          
          // Add each cell as a button (first is primary, others are secondary)
          const ctaRow = headline.querySelector('.cta-row');
          link.className = `btn ${cellIndex === 0 ? 'primary' : 'secondary'}`;
          
          // Open external links in new tab, keep anchor links on same page
          const href = link.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('/') && !href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          }
          
          ctaRow.appendChild(link.cloneNode(true));
        }
      }
      // Row 5+: Images
      else {
        const img = cell.querySelector('img');
        if (img) {
          if (!logoWrap) {
            logoWrap = document.createElement('div');
            logoWrap.className = 'logo-wrap';
          }
          const picture = createOptimizedPicture(img.src, img.alt, true, [{ width: '520' }]);
          logoWrap.appendChild(picture);
        }
      }
    });
  });

  // Add components to cta-hero inner
  ctaHeroInner.appendChild(headline);
  if (logoWrap) {
    ctaHeroInner.appendChild(logoWrap);
  }

  // Add lightning bolt effect
  const bolt = document.createElement('div');
  bolt.className = 'bolt';
  bolt.setAttribute('aria-hidden', 'true');

  // Replace block content
  block.replaceChildren(bolt, ctaHeroInner);
}
