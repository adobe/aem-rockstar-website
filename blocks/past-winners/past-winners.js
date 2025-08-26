export default function decorate(block) {
  const winnerCards = [];
  
  // Process each row from the block content
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 3) {
      const year = cells[0].textContent.trim();
      const photoDiv = cells[1];
      const name = cells[2].textContent.trim();
      const recordingLink = cells.length >= 4 ? cells[3].textContent.trim() : '';
      
      // Extract image from the photo cell
      const img = photoDiv.querySelector('img');
      const photoSrc = img ? img.src : '';
      const photoAlt = img ? img.alt : name;
      
      winnerCards.push({
        year,
        photoSrc,
        photoAlt,
        name,
        recordingLink
      });
    }
  });
  
  // Clear the block content
  block.innerHTML = '';
  
  // Create the container
  const container = document.createElement('div');
  container.className = 'past-winners-container';
  
  // Create header with trophy icon
  const header = document.createElement('div');
  header.className = 'past-winners-header';
  header.innerHTML = `
    <span class="trophy-icon">🏆</span>
    <h2>Past Winners</h2>
  `;
  
  // Create grid container
  const grid = document.createElement('div');
  grid.className = 'winners-grid';
  
  // Create winner cards
  winnerCards.forEach((winner) => {
    const card = document.createElement('div');
    card.className = 'winner-card';
    
    card.innerHTML = `
      <div class="year-badge">${winner.year}</div>
      ${winner.recordingLink ? 
        `<a href="${winner.recordingLink}" target="_blank" rel="noopener noreferrer" class="recording-link" title="Watch recording">
          <svg class="recording-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <polygon points="10,8 16,12 10,16" fill="currentColor"/>
          </svg>
         </a>` : ''
      }
      <div class="photo-container">
        ${winner.photoSrc ? 
          `<img src="${winner.photoSrc}" alt="${winner.photoAlt}" class="winner-photo">` :
          `<div class="photo-placeholder">Photo</div>`
        }
      </div>
      <div class="winner-info">
        <h3 class="winner-name">${winner.name}</h3>
      </div>
    `;
    
    grid.appendChild(card);
  });
  
  // Assemble the block
  container.appendChild(header);
  container.appendChild(grid);
  block.appendChild(container);
}
