/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript } from './scripts.js';

function loadAdobeLaunch() {
  const { host } = window.location;
  let scriptUrl = 'https://assets.adobedtm.com/52be42758645/f4f76a9081b6/launch-bd7785fa0dac-development.min.js';
  if (/\.hlx\.page/.test(host) || /\.hlx\.live/.test(host)) {
    // if on hlx.page or hlx.live upgrade to stage library
    scriptUrl = 'https://assets.adobedtm.com/52be42758645/f4f76a9081b6/launch-37775755caa8-staging.min.js';
  }

  if (/rockstar.adobeevents.com/.test(host) || /main--aem-rockstar-website--adobe.hlx.live/.test(host)) {
    // if on a prod domain, then use the prod library
    scriptUrl = 'https://assets.adobedtm.com/52be42758645/f4f76a9081b6/launch-d4e94ba1de20.min.js';
  }

  loadScript(scriptUrl, null, null, true);
}

function instrumentPage() {
  window.adobeDataLayer = window.adobeDataLayer || [];

  let theme = '';
  const themeEL = document.querySelector('meta[name="theme"]');
  if (themeEL) {
    theme = themeEL.getAttribute('content');
  }

  window.adobeDataLayer.push({
    page: {
      title: document.title,
      theme,
    },
  });
}

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
instrumentPage();
loadAdobeLaunch();
