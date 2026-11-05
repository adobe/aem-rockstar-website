import { buildBlock } from './aem.js';

function styleSection(section, style) {
  let metadata = section.querySelector('.section-metadata');
  if (!metadata) {
    metadata = buildBlock('section-metadata', [['Style', style]]);
    section.append(metadata);
  } else {
    const row = [...metadata.children].find((item) => item.firstElementChild?.textContent.trim().toLowerCase() === 'style');
    if (row) row.lastElementChild.textContent = style;
    else metadata.append(buildBlock('section-metadata', [['Style', style]]).firstElementChild);
  }
}

export function prepareRockstarPage(main) {
  const section = main?.firstElementChild;
  let heading = section?.querySelector(':scope > h1, :scope > h2, :scope > h3');
  if (!heading || main.querySelector('.rockstar-page-title')) return;

  const prose = ':scope > :is(h1, h2, h3, p, ul, ol)';
  section.querySelectorAll(`${prose}, ${prose} :is(li, strong, em)`).forEach((element) => {
    const text = element.firstChild;
    if (text?.nodeType === Node.TEXT_NODE) {
      text.textContent = text.textContent.replace(/^\s*[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D]+\s*/u, '');
    }
  });

  const lead = heading.nextElementSibling;
  const titleSection = document.createElement('div');
  titleSection.className = 'rockstar-page-title';
  if (heading.tagName !== 'H1') {
    const title = document.createElement('h1');
    [...heading.attributes].forEach(({ name, value }) => title.setAttribute(name, value));
    title.append(...heading.childNodes);
    heading.replaceWith(title);
    heading = title;
  }
  titleSection.append(heading);
  if (lead?.tagName === 'P') titleSection.append(lead);
  section.before(titleSection);

  if (![...section.children].some((child) => !child.classList.contains('section-metadata'))) {
    section.remove();
  }
}

/**
 * Adapts the authored home content without changing other pages or its source blocks.
 */
export function prepareRockstarHome(main) {
  if (!main) return;
  if (main.querySelector('.rockstar-hero')) {
    document.body.classList.add('rockstar-home');
    return;
  }
  const firstSection = main.firstElementChild;
  const title = firstSection?.querySelector('h1');
  if (!title) return;

  document.body.classList.add('rockstar-home');
  const recap = main.querySelector('.cards');
  const recording = recap?.querySelector('a[href*="/sessions/"]');
  const winner = firstSection.querySelector('h2');
  const copy = document.createElement('div');
  title.textContent = 'AEM Rockstar';
  copy.append(title);
  const invitation = document.createElement('p');
  invitation.textContent = 'Big ideas. Live demos. Loud applause.';
  copy.append(invitation);
  const action = document.createElement('p');
  const link = document.createElement('a');
  const hasCommunity = !!main.querySelector('.past-winners');
  link.href = recording?.href || (hasCommunity ? '#the-community' : '/en/submission-guide');
  link.textContent = 'Explore the submission guide';
  if (recording) link.textContent = 'Watch the 2026 replay';
  else if (hasCommunity) link.textContent = 'Meet the community';
  action.append(link);
  const hero = buildBlock('rockstar-hero', [[{ elems: [...copy.childNodes] }, '11', { elems: [action] }]]);
  if (winner) {
    const winnerNote = document.createElement('p');
    winnerNote.textContent = winner.textContent;
    recap?.firstElementChild?.firstElementChild?.append(winnerNote);
  }
  firstSection.replaceChildren(hero);
  styleSection(firstSection, 'gig-poster');

  if (recap) {
    const section = recap.closest('main > div');
    section.id = 'the-show';
    const heading = section.querySelector('h2');
    if (heading) heading.textContent = 'Missed the show? Hit play.';
    styleSection(section, 'gig-replay');
    const featured = recap.firstElementChild;
    const body = featured?.firstElementChild;
    const image = body?.querySelector('picture')?.closest('p');
    if (image) {
      const imageCell = document.createElement('div');
      imageCell.append(image);
      featured.prepend(imageCell);
    }
    if (recording && body) {
      const replayAction = document.createElement('p');
      const replayLink = recording.cloneNode(false);
      replayLink.removeAttribute('title');
      replayLink.textContent = 'Watch the 2026 finalists';
      replayAction.append(replayLink);
      body.append(replayAction);
    }
    const tourRows = [...recap.children].slice(1);
    if (tourRows.length) {
      const archive = document.createElement('details');
      archive.className = 'tour-archive';
      const summary = document.createElement('summary');
      summary.textContent = 'Backstage: the 2026 masterclass tour';
      archive.append(summary);
      tourRows.forEach((row) => {
        [...row.children].forEach((cell) => archive.append(...cell.childNodes));
        row.remove();
      });
      section.append(archive);
    }
  }

  const winners = main.querySelector('.past-winners');
  const history = winners?.closest('main > div');
  if (history) {
    history.id = 'the-community';
    styleSection(history, 'gig-community');
    const heading = history.querySelector('h2');
    if (heading) heading.textContent = 'The community is the headliner.';
    const story = document.createElement('details');
    story.className = 'rockstar-story';
    const summary = document.createElement('summary');
    summary.textContent = 'Our story, from 2017 to today';
    story.append(summary);
    [...history.children].filter((child) => child.tagName === 'P').forEach((p) => story.append(p));
    history.append(story);
  }

  const topics = main.querySelector('#focus-areas-for-2027-submissions')?.closest('main > div');
  if (topics) {
    styleSection(topics, 'gig-topics');
    const heading = topics.querySelector('h2');
    heading.textContent = 'What will make the next big demo?';
    const context = document.createElement('p');
    context.textContent = 'Explore the focus areas for 2027 submissions.';
    heading.after(context);
    if (history) history.before(topics);
  }
  const news = main.querySelector('.news')?.closest('main > div');
  if (news) {
    styleSection(news, 'news, gig-news');
    if (history) history.after(news);
  }
  const stats = main.querySelector('.columns')?.closest('main > div');
  if (stats) {
    styleSection(stats, 'gig-stats');
    main.append(stats);
  }
}

export function finishRockstarHome(main) {
  const group = main.querySelector('.gig-news .block-group-wrapper');
  if (!group) return;
  const olderNews = [...group.querySelectorAll(':scope > .news-wrapper')].slice(3);
  if (olderNews.length && !group.querySelector('.news-archive')) {
    const archive = document.createElement('details');
    archive.className = 'news-archive';
    const summary = document.createElement('summary');
    summary.textContent = 'More from the Rockstar archive';
    archive.append(summary, ...olderNews);
    group.insertBefore(archive, group.querySelector('.info-wrapper'));
  }
  main.querySelectorAll('.gig-news .info li').forEach((item) => {
    if (item.textContent.includes('OPEN NOW') && item.textContent.includes('early 2026')) {
      item.textContent = 'For the next edition, start with the submission guide. Opening dates are not announced here.';
    }
  });
  main.querySelectorAll('.gig-news .info a[href$="/submission-2026"]').forEach((link) => {
    link.textContent = 'View the 2026 submission page';
  });
  const guidance = [...group.querySelectorAll(':scope > .info-wrapper')];
  if (guidance.length) {
    const archive = document.createElement('details');
    archive.className = 'guidance-archive';
    const summary = document.createElement('summary');
    summary.textContent = 'Historical submission guidance (2024-2026)';
    const notice = document.createElement('p');
    notice.textContent = 'These are past-edition rules and entry instructions, not confirmed eligibility or submission dates for AEM Rockstar 11.';
    const content = document.createElement('div');
    content.className = 'historical-guidance';
    content.append(...guidance);
    archive.append(summary, notice, content);
    group.append(archive);
  }
}
