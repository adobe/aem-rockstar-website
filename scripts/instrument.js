import { loadScript } from './utils.js';

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

function instrumentBlocks() {
  window.adobeDataLayer = window.adobeDataLayer || [];
  const blocks = document.querySelectorAll('div.block');
  let blockIncrement = 1;
  blocks.forEach((block) => {
    const { blockName } = block.dataset;
    const blockId = `${blockName}-${blockIncrement}`;
    blockIncrement += 1;
    block.dataset.blockId = blockId;

    const pushData = {};
    pushData.block = {};

    let blockDl = {};
    if (block.dataset && block.dataset.dataLayer) {
      blockDl = JSON.parse(block.dataset.dataLayer);
    }

    blockDl.type = blockName;
    pushData.block[blockId] = blockDl;

    window.adobeDataLayer.push(pushData);
  });
}

export function event(eventName, eventInfo, element) {
  window.adobeDataLayer = window.adobeDataLayer || [];
  let { blockId } = element.dataset;
  if (!blockId) {
    const parentBLock = element.closest('div.block');
    blockId = parentBLock.dataset.blockId;
  }
  eventInfo.reference = `block.${blockId}`;
  window.adobeDataLayer.push({
    event: eventName,
    eventInfo,
  });
}

export function instrument() {
  loadAdobeLaunch();
  instrumentPage();
  instrumentBlocks();
}
