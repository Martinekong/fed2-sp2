import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs}'],
    ignores: ['node_modules'],
    languageOptions: { globals: globals.browser },
    extends: [js.configs.recommended],
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
