import { loadScript, readBlockConfig } from '../../scripts/aem.js';
import qrcode from '../../scripts/qrcode.js';

const dp = [
  ['Name', 'Votes'],
  ['Jack Jin', 1],
  ['Tanuj Jindal', 1],
  ['Bruno Mateos', 1],
];
function drawChart() {
  // eslint-disable-next-line no-undef
  const data = google.visualization.arrayToDataTable(dp);

  const options = {
    is3D: true,
    legend: { position: 'none' },
    colors: ['red', 'blue', 'orange'],
  };

  // eslint-disable-next-line no-undef
  const chart = new google.visualization.PieChart(document.getElementById('chart-container'));

  chart.draw(data, options);
}
export default async function decorate(block) {
  const config = readBlockConfig(block);
  await loadScript('https://js.pusher.com/7.0/pusher-with-encryption.min.js', { defer: true });
  await loadScript('https://www.gstatic.com/charts/loader.js', { defer: true });
  if (config.config === 'all') {
    // eslint-disable-next-line no-undef
    const pusher = new Pusher('9d2674cf3e51f6d87102', {
      cluster: 'us3',
      useTLS: true,
    });

    const channel = pusher.subscribe('rs-poll');

    // eslint-disable-next-line no-undef
    google.charts.load('current', { packages: ['corechart'] });

    channel.bind('rs-vote', (data) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < dp.length; i++) {
        if (dp[i][0] === data.name) {
          dp[i][1] += 1;
          drawChart();
        }
      }
      console.log(
        `The event rs-vote was triggered with data ${JSON.stringify(data)}`,
      );
    });

    const names = JSON.parse(config.names).members;
    const container = document.createElement('div');
    container.classList.add('container-flexbox');
    const col1 = document.createElement('div');

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
    qr1.innerHTML = qrcode1.createSvgTag({});
    col1.classList.add('col-1');
    col1.appendChild(qr1);
    const col1content = document.createElement('h2');
    // eslint-disable-next-line prefer-destructuring
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
    // eslint-disable-next-line prefer-destructuring
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
    // eslint-disable-next-line prefer-destructuring
    col3content.innerText = names[2];
    col3.appendChild(col3content);
    container.appendChild(col3);

    block.replaceWith(container);
    const chart = document.createElement('div');
    chart.id = 'chart-container';
    container.insertAdjacentElement('afterend', chart);
    // eslint-disable-next-line no-undef
    google.charts.setOnLoadCallback(drawChart);
  } else {
    const { name } = config;

    const container = document.createElement('div');
    container.classList.add('container-vote');

    if (sessionStorage.getItem('vote-expiration') === null || parseInt(sessionStorage.getItem('vote-expiration'), 10) < Date.now()) {
      const res = await fetch('https://6hcuq5rf1h.execute-api.us-east-1.amazonaws.com/vote', {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await res.json().then((data) => {
        const vote = document.createElement('h2');
        vote.innerText = data.message;
        container.appendChild(vote);
      });
      sessionStorage.setItem('vote-expiration', `${(Date.now() + (1000 * 30))}`);
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
