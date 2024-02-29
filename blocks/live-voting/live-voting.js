import { readBlockConfig } from '../../scripts/aem.js';
import qrcode from '../../scripts/qrcode.js';
import pusher from './pusher.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);

  if (config.config === 'all') {
    const names = JSON.parse(config.names).members;
    const container = document.createElement('div');
    container.classList.add('container-flexbox');
    const col1 = document.createElement('div');

    const qrcode1 = new qrcode(0, 'H');
    qrcode1.addData('https://rockstar.adobeevents.com/en/live/a.html');
    qrcode1.make();

    const qrcode2 = new qrcode(0, 'H');
    qrcode2.addData('https://rockstar.adobeevents.com/en/live/b.html');
    qrcode2.make();

    const qrcode3 = new qrcode(0, 'H');
    qrcode3.addData('https://rockstar.adobeevents.com/en/live/c.html');
    qrcode3.make();

    const qr1 = document.createElement('div');
    qr1.classList.add('qr1');
    qr1.innerHTML = qrcode1.createSvgTag({});
    col1.classList.add('col-1');
    col1.appendChild(qr1);
    const col1content = document.createElement('h2');
    col1content.innerText = names[0];
    col1.appendChild(col1content);
    container.appendChild(col1);

    // column two
    const col2 = document.createElement('div');
    col2.classList.add('col-2');
    const qr2 = document.createElement('div');
    qr2.innerHTML = qrcode2.createSvgTag({});
    col2.appendChild(qr2);

    const col2content = document.createElement('h2');
    col2content.innerText = names[1];
    col2.appendChild(col2content);
    container.appendChild(col2);

    // column three
    const col3 = document.createElement('div');
    col3.classList.add('col-3');
    const qr3 = document.createElement('div');
    qr3.innerHTML = qrcode3.createSvgTag({});
    col3.appendChild(qr3);
    const col3content = document.createElement('h2');
    col3content.innerText = names[2];
    col3.appendChild(col3content);
    container.appendChild(col3);

    block.replaceWith(container);
  } else {
    const { name } = config;
    console.log(name);

    const container = document.createElement('div');
    container.classList.add('container-vote');

    const res = await fetch('https://6hcuq5rf1h.execute-api.us-east-1.amazonaws.com/vote', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const text = await res.json().then((data) => {
      const vote = document.createElement('h2');
      vote.innerText = data.message;
      container.appendChild(vote);
    });

    block.replaceWith(container);

    // put a limit on times a person can vote
  }

  console.log(`mode: ${config.config}`);
}
