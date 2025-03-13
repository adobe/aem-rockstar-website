import { loadScript, readBlockConfig } from '../../scripts/aem.js';
import qrcode from '../../scripts/qrcode.js';

const dp = [
  ['Name', 'Votes'],
  ['Martin Altman', 1],
  ['Anian Weber', 1],
  ['Scott Simmer', 1],
];

async function onSubmit(token, name, button) {
  const res = await fetch('https://eae1ezhtx7.execute-api.us-east-1.amazonaws.com/dev/vote', {
    method: 'POST',
    body: JSON.stringify({ name: `${name}`, token: `${token}` }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  button.classList.add('disabled');
  await res.json().then((data) => {
    const vote = document.querySelector('#aem-rockstar-live-voting');
    vote.innerText = data.message;
  });
  sessionStorage.setItem('vote-expiration', `${(Date.now() + (1000 * 30))}`);
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  await loadScript('https://js.pusher.com/7.0/pusher-with-encryption.min.js', { defer: true });
  await loadScript('https://www.google.com/recaptcha/api.js?render=6Lc7idUqAAAAAPbV3RzZ52yjVj-UT4lIjXwF7nza', { defer: true });
  if (config.config === 'all') {
    const names = JSON.parse(config.names).members;
    const container = document.createElement('div');
    container.classList.add('container-flexbox');
    const col1 = document.createElement('div');
    col1.classList.add('col-1');

    // eslint-disable-next-line new-cap
    const qrcode1 = new qrcode(0, 'H');
    qrcode1.addData('https://rockstar.adobeevents.com/en/live/a');
    qrcode1.make();

    // eslint-disable-next-line new-cap
    const qrcode2 = new qrcode(0, 'H');
    qrcode2.addData('https://rockstar.adobeevents.com/en/live/b');
    qrcode2.make();

    // eslint-disable-next-line new-cap
    const qrcode3 = new qrcode(0, 'H');
    qrcode3.addData('https://rockstar.adobeevents.com/en/live/c');
    qrcode3.make();

    const qr1 = document.createElement('div');
    qr1.classList.add('qr1');
    const col1content = document.createElement('h2');
    const col1A = document.createElement('a');
    col1A.href = 'https://rockstar.adobeevents.com/en/live/a';
    // eslint-disable-next-line prefer-destructuring
    col1content.innerText = names[0];
    col1A.appendChild(col1content);
    col1.appendChild(col1A);
    container.appendChild(col1);

    // column two
    const col2 = document.createElement('div');
    col2.classList.add('col-2');
    const col2content = document.createElement('h2');
    const col2A = document.createElement('a');
    col2A.href = 'https://rockstar.adobeevents.com/en/live/b';
    // eslint-disable-next-line prefer-destructuring
    col2content.innerText = names[1];
    col2A.appendChild(col2content);
    col2.appendChild(col2A);
    container.appendChild(col2);

    // column three
    const col3 = document.createElement('div');
    col3.classList.add('col-3');
    const col3content = document.createElement('h2');
    const col3A = document.createElement('a');
    col3A.href = 'https://rockstar.adobeevents.com/en/live/c';
    // eslint-disable-next-line prefer-destructuring
    col3content.innerText = names[2];
    col3A.appendChild(col3content);
    col3.appendChild(col3A);
    container.appendChild(col3);
    block.replaceWith(container);
  } else if (config.config === 'qr-only') {
    const allCode = new qrcode(0, 'H');
    allCode.addData('https://rockstar.adobeevents.com/en/live/all');
    allCode.make();
    const qr = document.createElement('div');
    qr.classList.add('qr-all');
    qr.innerHTML = allCode.createSvgTag({});
    block.replaceWith(qr);
  } else {
    const { name } = config;

    const container = document.createElement('div');
    container.classList.add('container-vote');

    if (sessionStorage.getItem('vote-expiration') === null || parseInt(sessionStorage.getItem('vote-expiration'), 10) < Date.now()) {
      const captcha = document.createElement('button');
      const head = document.querySelector('#aem-rockstar-live-voting');
      head.textContent = config.name;
      captcha.classList.add('protected-vote');
      captcha.onclick = async () => {
        const token = await grecaptcha.execute('6Lc7idUqAAAAAPbV3RzZ52yjVj-UT4lIjXwF7nza', { action: 'submit' });
        if (!token) {
          throw new Error('Failed to get reCAPTCHA token');
        }
        await onSubmit(token, name, captcha);
      };
      container.appendChild(captcha);
      captcha.textContent = 'Vote';
    } else {
      const alreadyVoted = document.createElement('h2');
      const alreadyVotedP = document.createElement('p');
      alreadyVotedP.innerText = 'Please wait 30 seconds and reload this page to vote again for this person.';
      alreadyVoted.innerText = 'You have already voted.';
      container.appendChild(alreadyVoted);
      container.appendChild(alreadyVotedP);
    }

    block.replaceWith(container);
  }

  console.log(`mode: ${config.config}`);
}
