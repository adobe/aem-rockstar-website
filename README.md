# AEM Rockstar on Edge Delivery Services (aem.live)

A website for the AEM Rockstar competition, hosted on Adobe's Edge Delivery Services with Document Authoring

## Environments
- Preview: https://main--aem-rockstar-website--adobe.aem.page
- Live: https://main--aem-rockstar-website--adobe.aem.live

converted to use adaptive forms block

## Installation

```sh
npm i
```

## Tests

```sh
npm tst
```

## Local development

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Start Helix Pages Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
