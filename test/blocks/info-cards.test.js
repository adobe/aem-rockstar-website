/* global describe, it, before, after, afterEach */
import { expect } from '@esm-bundle/chai';
import decorate from '../../blocks/info-cards/info-cards.js';

const fixtures = [];
const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = new URL('../../blocks/info-cards/info-cards.css', import.meta.url).href;

before(async () => {
  await new Promise((resolve, reject) => {
    stylesheet.onload = resolve;
    stylesheet.onerror = reject;
    document.head.append(stylesheet);
  });
});

after(() => stylesheet.remove());
afterEach(() => fixtures.splice(0).forEach((block) => block.remove()));

describe('Info Cards icons variant', () => {
  [false, true].forEach((centered) => {
    it(`gives authored lists the full content width with ${centered ? 'centered' : 'left-aligned'} icons`, () => {
      const block = document.createElement('div');
      block.className = `info-cards icons${centered ? ' centered' : ''}`;
      block.innerHTML = `
        <div><div>Reusable cards</div></div>
        <div><div>
          <p><span class="icon"></span></p>
          <ul><li><strong>Build reusable components</strong> for production websites.</li></ul>
          <ol><li>Keep the authored content structure consistent.</li></ol>
        </div></div>
      `;
      document.body.append(block);
      fixtures.push(block);
      decorate(block);
      const card = block.querySelector('.card');
      const style = getComputedStyle(card);
      const contentWidth = card.clientWidth
        - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      block.querySelectorAll('ul, ol').forEach((list) => {
        expect(list.getBoundingClientRect().width).to.be.closeTo(contentWidth, 1);
        expect(list.scrollWidth).to.be.at.most(list.clientWidth);
      });
      expect(block.querySelector('.icon').getBoundingClientRect().width).to.equal(48);
      expect(getComputedStyle(block.querySelector('strong')).display).to.equal('inline');
    });
  });
});
