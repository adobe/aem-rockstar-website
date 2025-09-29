export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  // Create speakers grid
  const speakersGrid = document.createElement('div');
  speakersGrid.className = 'speakers-grid';

  // Row 0: Section title
  const titleRow = rows[0];
  const titleText = titleRow.textContent.trim();
  
  if (titleText) {
    const h2 = document.createElement('h2');
    h2.textContent = titleText;
    block.insertBefore(h2, block.firstChild);
  }

  // Get the number of speakers from any content row
  const imageRow = rows[1] ? [...rows[1].children] : [];
  const nameRow = rows[2] ? [...rows[2].children] : [];
  const titleRowData = rows[3] ? [...rows[3].children] : [];
  
  const speakerCount = Math.max(imageRow.length, nameRow.length, titleRowData.length);

  // Create speaker cards
  for (let i = 0; i < speakerCount; i++) {
    const speaker = document.createElement('div');
    speaker.className = 'speaker';

    // Create avatar
    const avatar = document.createElement('div');
    avatar.className = 'avatar';

    // Check for image in row 1
    const imageCell = imageRow[i];
    const img = imageCell?.querySelector('img');
    
    if (img) {
      // Use image as avatar
      const avatarImg = document.createElement('img');
      avatarImg.src = img.src;
      avatarImg.alt = img.alt || 'Speaker avatar';
      avatar.appendChild(avatarImg);
      avatar.classList.add('has-image');
    } else {
      // Use initials from name or fallback
      const nameCell = nameRow[i];
      const nameText = nameCell?.textContent.trim() || '';
      
      if (nameText) {
        // Extract initials from name
        const nameParts = nameText.split(' ');
        const initials = nameParts.map(part => part.charAt(0)).join('').toUpperCase();
        avatar.textContent = initials.substring(0, 2);
      } else {
        avatar.textContent = '??';
      }
    }
    
    speaker.appendChild(avatar);

    // Add name from row 2
    const nameCell = nameRow[i];
    if (nameCell?.textContent.trim()) {
      const name = document.createElement('strong');
      name.textContent = nameCell.textContent.trim();
      speaker.appendChild(name);
    }

    // Add title from row 3
    const titleCell = titleRowData[i];
    if (titleCell?.textContent.trim()) {
      const title = document.createElement('small');
      title.textContent = titleCell.textContent.trim();
      speaker.appendChild(title);
    }

    speakersGrid.appendChild(speaker);
  }

  // Remove original rows and add the grid
  rows.forEach(row => row.remove());
  block.appendChild(speakersGrid);
}
