const TIERS = ['Rising Star', 'Hitmaker', 'Chart Topper', 'Icon'];
const PAGE_SIZE = 24;

function normalize(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase().trim();
}

function buildCard({
  name, tier, picture, profileHref,
}) {
  const card = document.createElement('li');
  card.className = 'hof-member';
  const portrait = document.createElement('div');
  portrait.className = 'hof-portrait';
  if (picture) {
    const image = picture.matches('img') ? picture : picture.querySelector('img');
    image.width = 400;
    image.height = 400;
    image.loading = 'lazy';
    image.decoding = 'async';
    portrait.append(picture);
  } else {
    const initials = document.createElement('span');
    initials.className = 'hof-initials';
    initials.setAttribute('aria-hidden', 'true');
    initials.textContent = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('');
    portrait.append(initials);
  }
  const badge = document.createElement('p');
  badge.className = 'hof-tier';
  const icon = document.createElement('img');
  icon.src = `/icons/hof-${tier.toLowerCase().replaceAll(' ', '-')}.svg`;
  icon.alt = '';
  icon.width = 24;
  icon.height = 24;
  icon.loading = 'lazy';
  badge.append(icon, document.createTextNode(tier));
  const heading = document.createElement('h3');
  heading.textContent = name;
  if (profileHref) {
    const link = document.createElement('a');
    link.className = 'hof-member-link';
    link.href = profileHref;
    link.append(portrait, badge, heading);
    card.append(link);
  } else {
    card.append(portrait, badge, heading);
  }
  return card;
}

export default function decorate(block) {
  const members = [];
  let invalidRows = 0;
  [...block.children].forEach((row, index) => {
    const [imageCell, nameCell, tierCell] = row.children;
    const name = nameCell?.textContent.trim();
    const tier = TIERS.find((label) => normalize(label) === normalize(tierCell?.textContent || ''));
    if (!name || !tier) {
      invalidRows += 1;
      // eslint-disable-next-line no-console
      console.warn(`[hof-directory] Row ${index + 1} needs a name and a valid recognition tier.`);
    } else {
      const picture = imageCell.querySelector('picture:has(img), img');
      const authoredHref = nameCell.querySelector('a[href]')?.getAttribute('href');
      let profileHref;
      if (authoredHref) {
        const url = URL.canParse(authoredHref, window.location.href)
          ? new URL(authoredHref, window.location.href) : null;
        if (url?.origin === window.location.origin
          && url.pathname.startsWith('/en/masterclass/hall-of-fame/')) {
          profileHref = `${url.pathname}${url.search}${url.hash}`;
        } else {
          // eslint-disable-next-line no-console
          console.warn(`[hof-directory] Row ${index + 1} profile link must point to a Hall of Fame page on this site.`);
        }
      }
      members.push({
        name, tier, picture, profileHref,
      });
    }
  });
  members.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  const cards = new Map(members.map((member) => [member, buildCard(member)]));

  const controls = document.createElement('div');
  controls.className = 'hof-controls';
  const searchRow = document.createElement('div');
  searchRow.className = 'hof-search-row';
  const label = document.createElement('label');
  label.className = 'hof-search';
  const labelText = document.createElement('span');
  labelText.textContent = 'Search by name';
  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Find a Hall of Fame member';
  input.autocomplete = 'off';
  label.append(labelText, input);
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'hof-reset';
  reset.textContent = 'Reset';
  searchRow.append(label, reset);
  const filters = document.createElement('div');
  filters.className = 'hof-filters';
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'Filter members by recognition tier');
  const buttons = ['All', ...TIERS].map((tier) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.tier = tier;
    const count = tier === 'All' ? members.length : members.filter((member) => member.tier === tier).length;
    button.textContent = `${tier} (${count})`;
    filters.append(button);
    return button;
  });
  controls.append(searchRow, filters);

  const status = document.createElement('p');
  status.className = 'hof-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  const list = document.createElement('ul');
  list.className = 'hof-members';
  list.setAttribute('role', 'list');
  list.setAttribute('aria-label', 'Hall of Fame members');
  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'hof-more';
  more.textContent = 'Show more';

  let selectedTier = 'All';
  let limit = PAGE_SIZE;
  function render(append = false) {
    const query = normalize(input.value);
    const matches = members.filter((member) => (selectedTier === 'All' || member.tier === selectedTier)
      && normalize(member.name).includes(query));
    const offset = append ? list.children.length : 0;
    const next = matches.slice(offset, limit).map((member) => cards.get(member));
    if (append) list.append(...next);
    else list.replaceChildren(...next);
    more.hidden = limit >= matches.length;
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.tier === selectedTier));
    });
    if (!members.length) status.textContent = 'No members have been announced yet.';
    else if (!matches.length) status.textContent = 'No members match your search or tier filter. Try another name or reset the filters.';
    else status.textContent = `Showing ${Math.min(limit, matches.length)} of ${matches.length} ${matches.length === 1 ? 'member' : 'members'}.`;
    if (append && next.length) {
      next[0].tabIndex = -1;
      next[0].focus();
    }
  }
  input.addEventListener('input', () => {
    limit = PAGE_SIZE;
    render();
  });
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedTier = button.dataset.tier;
      limit = PAGE_SIZE;
      render();
    });
  });
  reset.addEventListener('click', () => {
    input.value = '';
    selectedTier = 'All';
    limit = PAGE_SIZE;
    render();
    input.focus();
  });
  more.addEventListener('click', () => {
    limit += PAGE_SIZE;
    render(true);
  });

  block.replaceChildren(controls, status, list, more);
  if (invalidRows) {
    const warning = document.createElement('p');
    warning.className = 'hof-content-error';
    warning.setAttribute('role', 'alert');
    warning.textContent = `${invalidRows} member ${invalidRows === 1 ? 'row needs' : 'rows need'} a name and one of these tiers: ${TIERS.join(', ')}.`;
    block.prepend(warning);
  }
  render();
}
