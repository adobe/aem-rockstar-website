import { loadScript } from '../../scripts/aem.js';

const FALLBACK_DATA = [
  ['Name', 'Votes'],
  ['Person One', 1],
  ['Person Two', 1],
  ['Person Three', 1],
];

const COLOR_PALETTE = [
  '#ff4d4d',
  '#4da3ff',
  '#ffb347',
  '#34d399',
  '#a78bfa',
  '#f472b6',
];

const TIMER_DURATION_MS = 2 * 60 * 1000;

function parseNumber(value) {
  const parsed = Number.parseInt(String(value).replace(/[^0-9]/g, ''), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getInitialData(block) {
  const table = block.querySelector('table');
  if (table) {
    const rows = [...table.querySelectorAll('tr')];
    const data = rows.map((row) => [...row.children].map((cell) => cell.textContent.trim()));
    if (data.length > 1) return data;
  }

  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length) {
    const data = [['Name', 'Votes']];
    rows.forEach((row) => {
      const cells = [...row.children];
      if (cells.length >= 2) {
        data.push([cells[0].textContent.trim(), cells[1].textContent.trim()]);
      }
    });
    if (data.length > 1) return data;
  }

  return FALLBACK_DATA;
}

function isHeaderLabel(name) {
  const normalized = String(name || '').trim().toLowerCase();
  return ['name', 'names', 'candidate', 'candidates'].includes(normalized);
}

function animateNumber(el, nextValue) {
  const startValue = parseNumber(el.dataset.value ?? el.textContent);
  if (startValue === nextValue) return;

  const startTime = window.performance.now();
  const duration = 700;

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - progress) * (1 - progress);
    const value = Math.round(startValue + (nextValue - startValue) * eased);
    el.textContent = value.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.dataset.value = String(nextValue);
    }
  };

  window.requestAnimationFrame(step);
}

function formatTimer(ms) {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.ceil(clamped / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default async function decorate(block) {
  await loadScript('https://js.pusher.com/7.0/pusher-with-encryption.min.js', { defer: true });
  document.body.classList.add('has-live-results');

  const initialData = getInitialData(block);
  const candidates = new Map();
  const rowsByName = new Map();
  let votesEnabled = false;

  initialData.slice(1).forEach(([name, votes], index) => {
    if (!name || isHeaderLabel(name)) return;
    candidates.set(name, {
      name,
      votes: parseNumber(votes),
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    });
  });

  const wrapper = document.createElement('section');
  wrapper.className = 'live-results live-results--fullscreen';
  wrapper.innerHTML = `
    <div class="live-results__header">
      <div>
        <p class="live-results__eyebrow">Now Live</p>
        <h2 class="live-results__title">Results Board</h2>
      </div>
      <div class="live-results__meta">
        <div class="live-results__total">
          <span class="live-results__total-label">Total Votes</span>
          <span class="live-results__total-value" data-value="0">0</span>
        </div>
        <div class="live-results__timer">
          <span class="live-results__timer-label">Time Remaining</span>
          <span class="live-results__timer-value" data-value="120000">02:00</span>
          <div class="live-results__timer-controls">
            <button class="live-results__timer-adjust" type="button" data-adjust="-15">-15s</button>
            <button class="live-results__timer-adjust" type="button" data-adjust="15">+15s</button>
            <button class="live-results__timer-btn" type="button">Start</button>
          </div>
        </div>
      </div>
    </div>
    <div class="live-results__cards" role="list"></div>
  `;

  const list = wrapper.querySelector('.live-results__cards');
  const totalValue = wrapper.querySelector('.live-results__total-value');
  const timerValue = wrapper.querySelector('.live-results__timer-value');
  const timerButton = wrapper.querySelector('.live-results__timer-btn');
  const timerAdjustButtons = wrapper.querySelectorAll('.live-results__timer-adjust');

  const createCard = (candidate) => {
    const card = document.createElement('div');
    card.className = 'live-results__card';
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <div class="live-results__card-top">
        <span class="live-results__name"></span>
        <span class="live-results__count" data-value="${candidate.votes}">${candidate.votes}</span>
      </div>
      <div class="live-results__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100">
        <span class="live-results__bar-fill"></span>
      </div>
      <div class="live-results__card-footer">
        <span class="live-results__percent" aria-hidden="true"></span>
        <span class="live-results__trophy" aria-hidden="true">🏆</span>
      </div>
    `;
    card.style.setProperty('--accent', candidate.color);
    rowsByName.set(candidate.name, card);
    list.append(card);
    return card;
  };

  const render = (lastUpdatedName) => {
    const entries = [...candidates.values()];
    const total = entries.reduce((sum, item) => sum + item.votes, 0);
    const hasVotes = total > 0;
    wrapper.classList.toggle('live-results--no-votes', !hasVotes);
    animateNumber(totalValue, total);

    const firstRects = new Map();
    rowsByName.forEach((card, name) => {
      if (card.isConnected) {
        firstRects.set(name, card.getBoundingClientRect());
      }
    });

    entries.sort((a, b) => b.votes - a.votes);
    entries.forEach((candidate, index) => {
      const pct = total === 0 ? 0 : (candidate.votes / total) * 100;
      const card = rowsByName.get(candidate.name) ?? createCard(candidate);
      const nameEl = card.querySelector('.live-results__name');
      nameEl.textContent = hasVotes ? candidate.name : '';
      const countEl = card.querySelector('.live-results__count');
      animateNumber(countEl, candidate.votes);
      card.querySelector('.live-results__bar').setAttribute('aria-valuenow', Math.round(pct));
      card.style.setProperty('--pct', `${pct.toFixed(2)}%`);
      const scale = 0.9 + (pct / 100) * 0.25;
      card.style.setProperty('--scale', scale.toFixed(3));
      card.querySelector('.live-results__percent').textContent = `${pct.toFixed(1)}%`;
      card.classList.toggle('is-leading', index === 0 && total > 0);
      card.classList.toggle('is-updated', candidate.name === lastUpdatedName);
      list.append(card);
    });

    entries.forEach((candidate) => {
      const card = rowsByName.get(candidate.name);
      if (!card) return;
      const last = card.getBoundingClientRect();
      const first = firstRects.get(candidate.name);
      if (!first) return;
      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
      card.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: 'translate(0, 0)' },
        ],
        {
          duration: 520,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        },
      );
    });
  };

  let timerId = null;
  let remainingMs = TIMER_DURATION_MS;
  const minDurationMs = 15 * 1000;
  const maxDurationMs = 10 * 60 * 1000;
  const storageKey = 'live-results-history';
  const maxHistory = 5;

  const saveResults = () => {
    const entries = [...candidates.values()];
    const total = entries.reduce((sum, item) => sum + item.votes, 0);
    try {
      const history = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      const payload = {
        savedAt: new Date().toISOString(),
        totalVotes: total,
        results: entries
          .map((item) => ({
            name: item.name,
            votes: item.votes,
            percent: total === 0 ? 0 : Number(((item.votes / total) * 100).toFixed(1)),
          }))
          .sort((a, b) => b.votes - a.votes),
      };
      history.unshift(payload);
      if (history.length > maxHistory) history.length = maxHistory;
      window.localStorage.setItem(storageKey, JSON.stringify(history));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Unable to save live results', error);
    }
  };

  const updateTimer = (endTime) => {
    const now = Date.now();
    remainingMs = Math.max(0, endTime - now);
    timerValue.textContent = formatTimer(remainingMs);
    timerValue.dataset.value = String(remainingMs);

    if (remainingMs <= 0) {
      window.clearInterval(timerId);
      timerId = null;
      wrapper.classList.add('live-results--timer-ended');
      timerButton.textContent = 'Ended';
      timerButton.disabled = true;
      votesEnabled = false;
      list.querySelectorAll('.live-results__bar').forEach((bar) => bar.remove());
      saveResults();
    }
  };

  const updateTimerDisplay = () => {
    timerValue.textContent = formatTimer(remainingMs);
    timerValue.dataset.value = String(remainingMs);
  };

  timerAdjustButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (timerId) return;
      const adjustSeconds = Number.parseInt(button.dataset.adjust || '0', 10);
      const next = remainingMs + adjustSeconds * 1000;
      remainingMs = Math.min(maxDurationMs, Math.max(minDurationMs, next));
      updateTimerDisplay();
    });
  });

  timerButton.addEventListener('click', () => {
    if (timerId) return;
    wrapper.classList.remove('live-results--timer-ended');
    const endTime = Date.now() + remainingMs;
    updateTimer(endTime);
    timerButton.textContent = 'Running';
    timerButton.disabled = true;
    timerAdjustButtons.forEach((button) => {
      button.disabled = true;
    });
    wrapper.classList.add('live-results--timer-running');
    votesEnabled = true;
    timerId = window.setInterval(() => updateTimer(endTime), 250);
  });

  // eslint-disable-next-line no-undef
  const pusher = new Pusher('9d2674cf3e51f6d87102', {
    cluster: 'us3',
    useTLS: true,
  });

  const channel = pusher.subscribe('rs-poll');

  channel.bind('rs-vote', (data) => {
    if (!votesEnabled) return;
    const name = data?.name?.trim();
    if (!name || isHeaderLabel(name)) return;

    if (!candidates.has(name)) {
      const color = COLOR_PALETTE[candidates.size % COLOR_PALETTE.length];
      candidates.set(name, { name, votes: 0, color });
    }

    const candidate = candidates.get(name);
    candidate.votes += 1;
    render(name);

    window.setTimeout(() => {
      const card = rowsByName.get(name);
      if (card) card.classList.remove('is-updated');
    }, 1200);

    // eslint-disable-next-line no-console
    console.log(`The event rs-vote was triggered with data ${JSON.stringify(data)}`);
  });

  const section = block.closest('.section');
  if (section) section.classList.add('live-results-fullscreen');
  block.replaceWith(wrapper);
  updateTimerDisplay();
  render();
}
