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

async function showResults(block, blockConfig) {
  if (blockConfig.results !== 'true') {
    block.innerHTML = `
      <p>Thanks for voting. Results will be available later.</p>
    `;
    return;
  }
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
    voteCount.style.width = `${pct * 10}px`;

    div.appendChild(voteCount);

    block.appendChild(div);
    block.classList.add('poll-results');
  });
}

/**
 * loads and decorates the poll block
 * @param {Element} block The poll block element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);
  const src = config.source;
  const hasVoted = window.localStorage.getItem('poll-voted');
  if (hasVoted === 'yes') {
    await showResults(block, config);
    return;
  }

  // fetch poll question source
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
        showResults(block, config);
      });
    }
  });
  submit.innerText = 'Submit';
  buttonWrapper.appendChild(submit);

  if (config.results === 'true') {
    const results = document.createElement('a');
    results.classList.add('button', 'secondary');
    results.href = '#results';
    results.innerText = 'Show Results';
    results.addEventListener('click', (e) => {
      e.preventDefault();
      showResults(block, config);
    });
    buttonWrapper.appendChild(results);
  }
  form.appendChild(buttonWrapper);

  block.innerHTML = '';
  block.appendChild(form);
}
