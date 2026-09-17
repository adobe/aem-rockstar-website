import { loadScript, readBlockConfig } from '../../scripts/aem.js';
import qrcode from '../../scripts/qrcode.js';

function normalizeMember(entry) {
  if (typeof entry === 'string') {
    return { name: entry, headshot: null };
  }
  const headshot = entry.headshot || null;
  return { name: entry.name ?? '', headshot };
}

function appendHeadshotImg(parent, src) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  img.classList.add('live-voting-headshot');
  parent.appendChild(img);
}

function buildMemberColumn(member, href, colClass) {
  const col = document.createElement('div');
  col.classList.add(colClass);
  const link = document.createElement('a');
  link.href = href;
  const { name, headshot } = normalizeMember(member);
  const h2 = document.createElement('h2');
  h2.innerText = name;
  link.appendChild(h2);
  if (headshot) {
    appendHeadshotImg(link, headshot);
  }
  col.appendChild(link);
  return col;
}

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
    const hrefs = [
      'https://rockstar.adobeevents.com/en/live/x',
      'https://rockstar.adobeevents.com/en/live/y',
      'https://rockstar.adobeevents.com/en/live/z',
    ];
    const colClasses = ['col-1', 'col-2', 'col-3'];

    // eslint-disable-next-line new-cap
    const qrcode1 = new qrcode(0, 'H');
    qrcode1.addData('https://rockstar.adobeevents.com/en/live/x');
    qrcode1.make();

    // eslint-disable-next-line new-cap
    const qrcode2 = new qrcode(0, 'H');
    qrcode2.addData('https://rockstar.adobeevents.com/en/live/y');
    qrcode2.make();

    // eslint-disable-next-line new-cap
    const qrcode3 = new qrcode(0, 'H');
    qrcode3.addData('https://rockstar.adobeevents.com/en/live/z');
    qrcode3.make();

    const qr1 = document.createElement('div');
    qr1.classList.add('qr1');
    names.slice(0, 3).forEach((member, i) => {
      container.appendChild(buildMemberColumn(member, hrefs[i], colClasses[i]));
    });
    block.replaceWith(container);
  } else if (config.config === 'qr-only') {
    // eslint-disable-next-line new-cap
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
      if (head) {
        head.textContent = '';
        head.append(document.createTextNode(config.name));
        if (config.headshot) {
          appendHeadshotImg(head, config.headshot);
        }
      }
      captcha.classList.add('protected-vote');
      captcha.onclick = async () => {
        // eslint-disable-next-line no-undef
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
  // eslint-disable-next-line no-console
  console.log(`mode: ${config.config}`);
}
