/* global describe, it, afterEach */
import { expect } from '@esm-bundle/chai';
import {
  prepareRockstarHome, prepareRockstarFanzine, finishRockstarHome, prepareRockstarPage,
} from '../scripts/rockstar.js';
import decorateFanzine from '../blocks/rockstar-fanzine/rockstar-fanzine.js';
import { decorateBlock } from '../scripts/aem.js';

function fixture(html) {
  const main = document.createElement('main');
  main.innerHTML = html;
  return main;
}

describe('Rockstar homepage preparation', () => {
  afterEach(() => {
    document.body.classList.remove('rockstar-home');
  });

  describe('Rockstar inner page preparation', () => {
    it('omits decorative guide prefixes without changing wording, anchors, or inline content', () => {
      const main = fixture(`<div><h1>2026 Guide</h1><p>Introduction.</p>
        <h2 id="advice">\u{1F4A1} Submission advice</h2>
        <p><strong>\u2705 Have a finished idea.</strong> Keep the real advice.</p>
        <ul><li>\u2601\uFE0F <strong>AEM as a Cloud Service</strong></li></ul>
        <p>Inline \u{1F3A4} content stays.</p>
        <div class="info"><div><h3>\u{1F4A1} Configured title</h3></div></div></div>`);
      prepareRockstarPage(main);
      expect(main.querySelector('#advice').textContent).to.equal('Submission advice');
      expect(main.querySelector('strong').textContent).to.equal('Have a finished idea.');
      expect(main.querySelector('li').textContent).to.equal('AEM as a Cloud Service');
      expect(main.textContent).to.include('Inline \u{1F3A4} content stays.');
      expect(main.querySelector('.info h3').textContent).to.equal('\u{1F4A1} Configured title');
    });

    it('moves the original guide heading and introduction into a title band only once', () => {
      const main = fixture(`<div><h1 id="guide">2026 Guide</h1>
        <p>Original <em>introduction</em>.</p><h2>Submission advice</h2><p>Keep this guidance.</p>
        <div class="section-metadata"><div><div>Style</div><div>submission-guide-content</div></div></div>
      </div>`);
      prepareRockstarPage(main);
      prepareRockstarPage(main);
      expect(main.querySelectorAll('.rockstar-page-title')).to.have.lengthOf(1);
      expect(main.querySelector('.rockstar-page-title h1').id).to.equal('guide');
      expect(main.querySelector('.rockstar-page-title em').textContent).to.equal('introduction');
      expect(main.children[1].querySelector('h2').textContent).to.equal('Submission advice');
      expect(main.children[1].querySelector('.section-metadata')).not.to.equal(null);
    });

    it('preserves a closed submission notice and promotes its title without leaving an empty section', () => {
      const main = fixture(`<div><h3 id="entry">2026 AEM Rockstar Entry</h3>
        <p>The submission period has expired.</p><div class="section-metadata"></div></div>`);
      prepareRockstarPage(main);
      expect(main.children).to.have.lengthOf(1);
      expect(main.querySelector('h1').id).to.equal('entry');
      expect(main.querySelector('h1').textContent).to.equal('2026 AEM Rockstar Entry');
      expect(main.querySelector('p').textContent).to.include('expired');
    });

    it('does not recompose authored blocks or their configuration', () => {
      const main = fixture(`<div><div class="mc-register"><div><h3>Configured title</h3></div></div>
        <div class="agenda"><h2>Agenda</h2></div></div>`);
      const original = main.innerHTML;
      prepareRockstarPage(main);
      expect(main.innerHTML).to.equal(original);
    });
  });

  it('leaves content without a homepage heading untouched', () => {
    const main = fixture('<div><p>Another surface</p></div>');
    prepareRockstarHome(main);
    expect(main.querySelector('.rockstar-hero')).to.equal(null);
    expect(document.body.classList.contains('rockstar-home')).to.equal(false);
  });

  it('preserves the replay and promotes tour content and photos into an always-visible section', () => {
    const main = fixture(`
      <div><h1>AEM Rockstar</h1><h2>The previous winner</h2></div>
      <div><h2>Recap</h2><div class="cards">
        <div><div><p><a href="/sessions/recording"><picture><img alt=""></picture></a></p>
        <p>Original demo description</p></div></div>
        <div><div><p><picture><img src="/tour-logo.png" alt=""></picture>Historical tour information</p>
          <p>COMPLETED</p><ul><li>April 9-10 // New York City</li></ul>
          <p><a href="/en/masterclass">More Info</a></p></div></div>
        <div><div><p><picture><img src="/tour-photo.png" alt=""></picture></p></div></div>
      </div></div>`);
    const logo = main.querySelector('img[src="/tour-logo.png"]');
    const photo = main.querySelector('img[src="/tour-photo.png"]');
    prepareRockstarHome(main);
    prepareRockstarHome(main);
    expect(main.querySelectorAll('.rockstar-hero')).to.have.lengthOf(1);
    expect(main.querySelector('.rockstar-hero a').getAttribute('href'))
      .to.include('/sessions/recording');
    expect(main.querySelector('#the-show').textContent).to.include('Original demo description');
    expect(main.querySelector('#the-show').textContent).to.include('The previous winner');
    const backstage = main.querySelector('#backstage');
    expect(main.querySelectorAll('#backstage')).to.have.lengthOf(1);
    expect(backstage.previousElementSibling.id).to.equal('the-show');
    expect(backstage.querySelector('h2').textContent).to.include('Backstage');
    expect(backstage.querySelector('details, summary')).to.equal(null);
    expect(backstage.textContent).to.include('Historical tour information');
    expect(backstage.textContent).to.include('COMPLETED');
    expect(backstage.querySelector('li').textContent).to.equal('April 9-10 // New York City');
    expect(backstage.querySelector('a').getAttribute('href')).to.equal('/en/masterclass');
    expect(backstage.querySelector('.backstage-tour figure img')).to.equal(logo);
    expect(backstage.querySelector('.backstage-tour p').textContent).to.equal('Historical tour information');
    expect(backstage.querySelector('.backstage-gallery img')).to.equal(photo);
    expect(main.querySelector('#the-show').contains(backstage)).to.equal(false);
    expect(main.querySelector('.cards').children).to.have.lengthOf(1);
  });

  it('provides a real guide destination when replay and community content are omitted', () => {
    const main = fixture('<div><h1>AEM Rockstar</h1></div>');
    prepareRockstarHome(main);
    expect(main.querySelector('.rockstar-hero a').getAttribute('href'))
      .to.include('/en/submission-guide');
    expect(main.querySelector('.rockstar-hero a').textContent).to.equal('Explore the submission guide');
  });

  it('preserves an explicitly authored campaign hero', () => {
    const main = fixture('<div><div class="rockstar-hero"><h1>Author headline</h1></div></div>');
    prepareRockstarHome(main);
    expect(main.querySelector('h1').textContent).to.equal('Author headline');
    expect(document.body.classList.contains('rockstar-home')).to.equal(true);
  });

  it('features the genuine past winner and keeps the replay destination in a single fanzine hero', () => {
    const main = fixture(`<div><h1>AEM Rockstar</h1></div>
      <div><h2>Recap</h2><div class="cards"><div><div>
        <p><a href="/sessions/2026-recording">Recording</a></p><p>Real recording description.</p>
      </div></div></div></div>
      <div><h2>Past winners</h2><div class="past-winners"><div><div>2026</div>
        <div><picture><img src="/portrait.jpg" alt=""></picture></div>
        <div>Actual Winner</div><div>/sessions/winner</div></div></div></div>`);
    prepareRockstarFanzine(main);
    prepareRockstarFanzine(main);
    const block = main.querySelector('.rockstar-fanzine');
    expect(main.querySelectorAll('.rockstar-fanzine')).to.have.lengthOf(1);
    expect(block.querySelector('a').getAttribute('href')).to.include('/sessions/2026-recording');
    expect(block.querySelector('img').alt).to.equal('Actual Winner');
    expect(block.querySelector('img').loading).to.equal('eager');
    expect(block.querySelector('figcaption').textContent).to.include('2026 AEM Rockstar winner');
    expect(main.querySelector('.past-winners').textContent).to.include('Actual Winner');
    expect(main.querySelector('.cards').textContent).to.include('Real recording description.');
    expect(main.querySelector('#backstage')).to.equal(null);
    decorateBlock(block);
    decorateFanzine(block);
    expect(block.querySelector('.fanzine-masthead h1').textContent).to.include('AEM Rockstar 11');
    expect(block.querySelector('.fanzine-story a')).not.to.equal(null);
    expect(block.querySelector('.fanzine-feature figure')).not.to.equal(null);
    expect(block.querySelector('p > figure')).to.equal(null);
  });

  it('keeps a usable guide action without inventing a winner or replay when those fields are omitted', () => {
    const main = fixture('<div><h1>AEM Rockstar</h1></div>');
    prepareRockstarFanzine(main);
    const block = main.querySelector('.rockstar-fanzine');
    decorateFanzine(block);
    expect(block.querySelector('a').getAttribute('href')).to.include('/en/submission-guide');
    expect(block.textContent).not.to.include('2026 finalists');
    expect(block.querySelector('.fanzine-feature')).to.equal(null);
  });

  it('does not replace an explicitly authored hero when preparing the fanzine option', () => {
    const main = fixture('<div><div class="rockstar-hero"><h1>Author headline</h1></div></div>');
    prepareRockstarFanzine(main);
    expect(main.querySelector('h1').textContent).to.equal('Author headline');
    expect(main.querySelector('.rockstar-fanzine')).to.equal(null);
  });

  it('archives older decorated news once and labels the historical submission destination', () => {
    const main = fixture(`<div class="gig-news"><div class="block-group-wrapper">
      <div class="news-wrapper">One</div><div class="news-wrapper">Two</div>
      <div class="news-wrapper">Three</div><div class="news-wrapper">Four</div>
      <div class="info-wrapper"><div class="info">
        <ul><li>Submissions are OPEN NOW and will remain open until early 2026</li></ul>
        <a href="/en/submission-2026">Submit Your Idea</a>
      </div></div>
    </div></div>`);
    finishRockstarHome(main);
    finishRockstarHome(main);
    expect(main.querySelectorAll('.news-archive')).to.have.lengthOf(1);
    expect(main.querySelector('.news-archive').textContent).to.include('Four');
    expect(main.querySelectorAll('.block-group-wrapper > .news-wrapper')).to.have.lengthOf(3);
    expect(main.textContent).not.to.include('OPEN NOW');
    expect(main.querySelector('.info a').textContent).to.equal('View the 2026 submission page');
    expect(main.querySelectorAll('.guidance-archive')).to.have.lengthOf(1);
    expect(main.querySelector('.guidance-archive summary').textContent).to.include('2024-2026');
    expect(main.querySelector('.guidance-archive').textContent)
      .to.include('not confirmed eligibility or submission dates for AEM Rockstar 11');
  });
});
