export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;
  
  // Create cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-row';
  
  const titleRow = [...rows[0].children];
  const contentRow = [...rows[1].children];
  
  // Create a card for each non-empty title cell
  titleRow.forEach((titleCell, index) => {
    const titleText = titleCell.textContent.trim();
    if (!titleText) return;
    
    const card = document.createElement('div');
    card.className = 'card';
    
    // Add title
    const h2 = document.createElement('h2');
    h2.textContent = titleText;
    card.appendChild(h2);
    
    // Add content from corresponding cell in second row
    const contentCell = contentRow[index];
    if (contentCell?.textContent.trim()) {
      // Copy structured elements or create paragraph
      if (contentCell.children.length > 0) {
        [...contentCell.children].forEach(element => {
          if (['P', 'UL', 'OL'].includes(element.tagName)) {
            card.appendChild(element.cloneNode(true));
          }
        });
      } else {
        const p = document.createElement('p');
        p.innerHTML = contentCell.innerHTML;
        card.appendChild(p);
      }
    }
    
    cardsContainer.appendChild(card);
  });
  
  block.replaceChildren(cardsContainer);
}
