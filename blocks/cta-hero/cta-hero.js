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
      } else if (rowIndex === 1 && content) {
      // Row 1: Kicker text
        const kicker = document.createElement('p');
        kicker.className = 'kicker';
        kicker.textContent = content;
        headline.appendChild(kicker);
      } else if (rowIndex === 2 && content) {
      // Row 2: Main headline
        const h1 = document.createElement('h1');
        h1.textContent = content;
        headline.appendChild(h1);
      } else if (rowIndex === 3 && content) {
      // Row 3: Description paragraph
        const p = document.createElement('p');
        p.innerHTML = cell.innerHTML;
        headline.appendChild(p);
      } else if (rowIndex === 4 && content) {
      // Row 4: Date pill(s) — supports a single value or a <ul> of multiple dates
        const listItems = cell.querySelectorAll('li');
        if (listItems.length > 0) {
          listItems.forEach((li) => {
            const datePill = document.createElement('time');
            datePill.className = 'date-pill';
            datePill.innerHTML = `<span class="dot"></span> ${li.textContent.trim()}`;
            headline.appendChild(datePill);
          });
        } else {
          const datePill = document.createElement('time');
          datePill.className = 'date-pill';
          datePill.innerHTML = `<span class="dot"></span> ${content}`;
          headline.appendChild(datePill);
        }
      } else if (rowIndex === 5) {
      // Row 5: CTA buttons (each cell is a button; first cell supports a <ul> of links)
        const addLink = (link, index) => {
          let ctaRow = headline.querySelector('.cta-row');
          if (!ctaRow) {
            ctaRow = document.createElement('div');
            ctaRow.className = 'cta-row';
            headline.appendChild(ctaRow);
          }
          link.className = `btn ${cellIndex === 0 ? 'primary' : 'secondary'}`;
          const href = link.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('/') && !href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          }
          ctaRow.appendChild(link.cloneNode(true));
        };

        if (cellIndex === 0) {
          const listItems = cell.querySelectorAll('li a');
          if (listItems.length > 0) {
            let ctaRow = headline.querySelector('.cta-row');
            if (!ctaRow) {
              ctaRow = document.createElement('div');
              ctaRow.className = 'cta-row';
              headline.appendChild(ctaRow);
            }
            const group = document.createElement('div');
            group.className = 'cta-primary-group';
            listItems.forEach((link, i) => {
              const a = link.cloneNode(true);
              a.className = 'btn primary';
              const href = a.getAttribute('href');
              if (href && !href.startsWith('#') && !href.startsWith('/') && !href.includes(window.location.hostname)) {
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener noreferrer');
              }
              group.appendChild(a);
            });
            ctaRow.appendChild(group);
          } else {
            const link = cell.querySelector('a');
            if (link) addLink(link, 0);
          }
        } else {
          const link = cell.querySelector('a');
          if (link) addLink(link, cellIndex);
        }
      } else {
      // Row 6+: Images
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
