export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  // Process agenda header (first two rows: title, then badge)
  const agendaHeader = document.createElement('div');
  agendaHeader.className = 'agenda-header';
  
  // Row 0: Main title
  const titleRow = rows[0];
  const titleCell = titleRow?.children[0];
  if (titleCell && titleCell.textContent.trim()) {
    const titleContent = titleCell.cloneNode(true);
    agendaHeader.appendChild(titleContent);
  }
  
  // Row 1: Day badge (optional)
  const badgeRow = rows[1];
  const badgeCell = badgeRow?.children[0];
  if (badgeCell && badgeCell.textContent.trim()) {
    const dayBadge = document.createElement('div');
    dayBadge.className = 'day-badge';
    dayBadge.textContent = badgeCell.textContent.trim();
    agendaHeader.appendChild(dayBadge);
  }

  // Process agenda items (remaining rows after header rows)
  const agendaList = document.createElement('div');
  agendaList.className = 'agenda-list';
  agendaList.setAttribute('role', 'list');

  // Skip first two rows (title and badge), start from row 2
  const agendaRows = rows.slice(2);
  
  agendaRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return; // Need at least 2 columns
    
    const timeCell = cells[0];
    const titleCell = cells[1];
    const sessionTypeCell = cells[2];
    const descriptionCell = cells[3];
    
    const timeText = timeCell?.textContent.trim() || '';
    const titleText = titleCell?.textContent.trim() || '';
    const sessionTypeText = sessionTypeCell?.textContent.trim() || '';
    const descriptionText = descriptionCell?.textContent.trim() || '';
    
    if (!timeText && !titleText) return; // Skip completely empty rows
    
    // Check if this is a break (only 2 cells with content, or empty session type and description)
    const isBreak = (cells.length === 2) || (!sessionTypeText && !descriptionText && titleText);
    
    if (isBreak) {
      // Create break row - time and break label
      const breakRow = document.createElement('div');
      breakRow.className = 'agenda-break';
      breakRow.setAttribute('role', 'listitem');
      breakRow.setAttribute('aria-label', 'Break');
      
      const timeSpan = document.createElement('span');
      timeSpan.className = 'time';
      timeSpan.textContent = timeText;
      
      const labelSpan = document.createElement('span');
      labelSpan.className = 'label';
      labelSpan.textContent = titleText;
      
      breakRow.appendChild(timeSpan);
      breakRow.appendChild(labelSpan);
      
      agendaList.appendChild(breakRow);
    } else {
      // Create regular agenda row
      const agendaRow = document.createElement('div');
      agendaRow.className = 'agenda-row';
      agendaRow.setAttribute('role', 'listitem');
      
      // Time column
      const timeDiv = document.createElement('div');
      timeDiv.className = 'time';
      timeDiv.textContent = timeText;
      
      // Content column
      const contentDiv = document.createElement('div');
      contentDiv.className = 'content';
      
      // Topic with session type chip
      if (titleText) {
        const topic = document.createElement('h3');
        topic.className = 'topic';
        topic.appendChild(document.createTextNode(titleText));
        
        // Add session type chip if provided
        if (sessionTypeText) {
          const chip = document.createElement('span');
          chip.className = `chip ${getSessionTypeClass(sessionTypeText)}`;
          chip.setAttribute('aria-label', `Format: ${sessionTypeText}`);
          chip.textContent = sessionTypeText;
          topic.appendChild(chip);
        }
        
        contentDiv.appendChild(topic);
      }
      
      // Description
      if (descriptionText) {
        const desc = document.createElement('p');
        desc.className = 'desc';
        desc.innerHTML = descriptionCell.innerHTML;
        contentDiv.appendChild(desc);
      }
      
      agendaRow.appendChild(timeDiv);
      agendaRow.appendChild(contentDiv);
      
      agendaList.appendChild(agendaRow);
    }
  });

  // Replace original content
  const originalRows = [...block.children];
  originalRows.forEach(row => row.remove());
  
  // Add header and agenda list to block
  block.appendChild(agendaHeader);
  block.appendChild(agendaList);
}

// Helper function to get CSS class for session type
function getSessionTypeClass(sessionType) {
  const lowerType = sessionType.toLowerCase();
  
  if (lowerType.includes('session')) return 'session';
  if (lowerType.includes('hands-on') || lowerType.includes('hands‑on') || lowerType.includes('lab')) return 'handson';
  if (lowerType.includes('q&a') || lowerType.includes('question') || lowerType.includes('ask')) return 'qna';
  
  // Default to session if no match
  return 'session';
}
