export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const [copy, edition, story, feature] = row.children;
  copy?.classList.add('fanzine-masthead');
  const title = copy?.querySelector('h1, h2, h3');
  if (edition && title) {
    const stamp = document.createElement('span');
    stamp.className = 'fanzine-edition';
    stamp.textContent = edition.textContent.trim();
    stamp.setAttribute('aria-label', `Edition ${stamp.textContent}`);
    if (title.textContent.trim() === 'AEM Rockstar') {
      const lineBreak = document.createElement('br');
      lineBreak.className = 'fanzine-title-break';
      title.replaceChildren('AEM ', lineBreak, 'Rockstar ', stamp);
    } else {
      title.append(' ', stamp);
    }
  }
  edition?.remove();
  const spread = document.createElement('div');
  spread.className = 'fanzine-spread';
  if (story) {
    story.classList.add('fanzine-story');
    const heading = story.querySelector('h2');
    if (heading?.textContent === 'Missed the show? Hit play.') {
      heading.replaceChildren('Missed the show?', document.createElement('br'), 'Hit play.');
    }
    spread.append(story);
  }
  const figure = feature?.querySelector('figure');
  if (figure) {
    feature.replaceChildren(figure);
    feature.classList.add('fanzine-feature');
    spread.append(feature);
  }
  if (copy) block.replaceChildren(copy, spread);
}
