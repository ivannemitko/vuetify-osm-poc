/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

import js from '@eslint/js';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  js.configs.recommended, // Base JS rules

  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),

  {
    rules: {
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'vue/multi-word-component-names': 'off',
    },
  },

  // Customizations
  {
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'curly': ['error', 'multi-line', 'consistent'],
      'eqeqeq': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],

      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/block-order': ['error', {
         'order': ['template', 'script', 'style'],
      }],
    },
  },

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
];
