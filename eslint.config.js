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
      'no-use-before-define': ['error', { functions: true, classes: true, variables: true }],
      'no-console': 'warn',
      'no-await-in-loop': 'error',
      'no-bitwise': 'error',
      'new-cap': ['error', {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
      }],
      'max-len': ['error', 100, 2, {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'object-curly-newline': ['error', {
        ObjectExpression: { minProperties: 4, multiline: true, consistent: true },
        ObjectPattern: { minProperties: 4, multiline: true, consistent: true },
        ImportDeclaration: { minProperties: 4, multiline: true, consistent: true },
        ExportDeclaration: { minProperties: 4, multiline: true, consistent: true },
      }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'ForOfStatement',
          message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
      'guard-for-in': 'error',
      'import/prefer-default-export': 'error',
      'import/no-cycle': ['error', { maxDepth: '∞' }],
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
