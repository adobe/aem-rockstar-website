import { loadScript } from '../../scripts/aem.js';

const dp = [
  ['Name', 'Votes'],
  ['Martin Altman', 1],
  ['Anian Weber', 1],
  ['Scott Simmer', 1],
];

function drawChart() {
  // eslint-disable-next-line no-undef
  const data = google.visualization.arrayToDataTable(dp);

  const options = {
    is3D: true,
    legend: { position: 'top', textStyle: { fontSize: 24 }, alignment: 'center' },
    colors: ['red', 'blue', 'orange'],
    height: 700,
  };

  // eslint-disable-next-line no-undef
  const chart = new google.visualization.PieChart(document.getElementById('chart-container'));

  chart.draw(data, options);
}

export default async function decorate(block) {
  await loadScript('https://www.gstatic.com/charts/loader.js', { defer: true });
  await loadScript('https://js.pusher.com/7.0/pusher-with-encryption.min.js', { defer: true });
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
    // eslint-disable-next-line no-console
    console.log(
      `The event rs-vote was triggered with data ${JSON.stringify(data)}`,
    );
  });

  const chart = document.createElement('div');
  chart.id = 'chart-container';
  block.replaceWith(chart);
  // eslint-disable-next-line no-undef
  google.charts.setOnLoadCallback(drawChart);
}
