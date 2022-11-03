/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { toClassName, readBlockConfig } from '../../scripts/scripts.js';

function showVotedMessage(block) {
  block.innerHTML = `
    <p>Thanks for voting. Results will be available later.</p>
  `;
}

async function showResults(block, blockConfig) {
  const resp = await fetch(`${blockConfig.source}.json?sheet=results`);
  const json = await resp.json();
  const resultData = {};
  let totalVotes = 0;
  json.data.forEach((vote) => {
    const { name, voteCount } = vote;
    const votes = parseInt(voteCount, 10);
    resultData[name] = votes;
    totalVotes += votes;
  });

  block.innerHTML = '';
  Object.keys(resultData).forEach((name) => {
    const div = document.createElement('div');
    const label = document.createElement('span');
    label.classList.add('poll-result-label');
    label.innerText = name;
    div.appendChild(label);

    const voteCount = document.createElement('span');
    voteCount.classList.add('poll-result-votes');
    const pct = Math.round((parseInt(resultData[name], 10) / parseInt(totalVotes, 10)) * 100);
    voteCount.innerText = `${pct}%`;
    // dynamically set width
    voteCount.style.width = `${(pct * 10) + 25}px`;

    div.appendChild(voteCount);

    block.appendChild(div);
    block.classList.add('poll-results');
  });
}

async function showPoll(block, blockConfig) {
  // fetch poll question source
  const src = blockConfig.source;
  const resp = await fetch(`${src}.json`);
  const json = await resp.json();

  // render poll as a form with radio buttons
  const form = document.createElement('form');
  json.data.forEach((option) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('poll-option-wrapper');
    const input = document.createElement('input');
    input.classList.add('pollOpt');
    input.type = 'radio';
    input.value = option.value;
    input.id = toClassName(option.name);
    input.name = 'poll-question';
    input.dataset.name = option.name;

    const label = document.createElement('label');
    label.for = toClassName(option.name);
    label.innerText = option.name;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    form.appendChild(wrapper);
  });

  // add and wire up submit button and view results link
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('button-container');
  const submit = document.createElement('a');
  submit.classList.add('button');
  submit.href = '#submit';
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    const selected = block.querySelector('.pollOpt:checked');
    if (selected) {
      // post to results sheet then show the results
      const data = {
        data: {
          timestamp: new Date().getTime(),
          voteValue: selected.dataset.name,
        },
      };

      fetch(src, {
        method: 'POST',
        body: JSON.stringify(data),
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(() => {
        window.localStorage.setItem('poll-voted', 'yes');
        initState(block, blockConfig); // eslint-disable-line no-use-before-define
      });
    }
  });
  submit.innerText = 'Submit';
  buttonWrapper.appendChild(submit);
  form.appendChild(buttonWrapper);

  block.innerHTML = '';
  block.appendChild(form);
}

async function initState(block, blockConfig) {
  const hasVoted = window.localStorage.getItem('poll-voted') === 'yes';
  const results = blockConfig.results === 'true';

  if (results) {
    // just show show results
    await showResults(block, blockConfig);
  } else if (hasVoted) {
    // show thanks for voting message
    showVotedMessage(block);
  } else {
    // show the poll and let them vote
    await showPoll(block, blockConfig);
  }
}

/**
 * loads and decorates the poll block
 * @param {Element} block The poll block element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);
  await initState(block, config);
}
