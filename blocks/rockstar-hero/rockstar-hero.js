export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  row.classList.add('rockstar-bill');
  const [copy, edition, action] = row.children;
  copy?.classList.add('rockstar-title');
  edition?.classList.add('rockstar-edition');
  if (edition) edition.setAttribute('aria-label', `Edition ${edition.textContent.trim()}`);
  action?.classList.add('rockstar-ticket');
  const title = copy?.querySelector('h1');
  if (title?.textContent.trim() === 'AEM Rockstar') {
    title.replaceChildren(document.createTextNode('AEM'), document.createElement('br'), document.createTextNode('Rockstar'));
  }
}
