/* global describe, it, afterEach */
import { expect } from '@esm-bundle/chai';
import { prepareRockstarHome, finishRockstarHome, prepareRockstarPage } from '../scripts/rockstar.js';

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

  it('preserves the authored replay and moves tour content into an archive', () => {
    const main = fixture(`
      <div><h1>AEM Rockstar</h1><h2>The previous winner</h2></div>
      <div><h2>Recap</h2><div class="cards">
        <div><div><p><a href="/sessions/recording"><picture><img alt=""></picture></a></p>
        <p>Original demo description</p></div></div>
        <div><div><p>Historical tour information</p></div></div>
      </div></div>`);
    prepareRockstarHome(main);
    prepareRockstarHome(main);
    expect(main.querySelectorAll('.rockstar-hero')).to.have.lengthOf(1);
    expect(main.querySelector('.rockstar-hero a').getAttribute('href'))
      .to.include('/sessions/recording');
    expect(main.querySelector('#the-show').textContent).to.include('Original demo description');
    expect(main.querySelector('#the-show').textContent).to.include('The previous winner');
    expect(main.querySelector('.tour-archive').textContent).to.include('Historical tour information');
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
