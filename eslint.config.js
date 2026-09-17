const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');

module.exports = [
  {
    ignores: ['blocks/n8n-form/n8n-code/**', 'scripts/qrcode.js'],
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      parser: require('@babel/eslint-parser'),
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        requireConfigFile: false,
        allowImportExportEverywhere: true,
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        vars: 'all', args: 'after-used', ignoreRestSiblings: true, caughtErrors: 'none',
      }],
      // allow reassigning param
      'no-param-reassign': [2, { props: false }],
      'linebreak-style': ['error', 'unix'],
      'import/extensions': ['error', {
        js: 'always',
      }],
    },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
];
