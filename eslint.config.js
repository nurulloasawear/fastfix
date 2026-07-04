import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'public/mockServiceWorker.js']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Allow exporting constants (status-tone maps, widget catalogues, etc.) alongside
      // components — fast refresh handles constants fine; only mixed function exports are flagged.
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
      // A feature is a black box: import it only through its public API (index.ts).
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message:
                'Import a feature only through its public API: @/features/<name> — never a deep path.',
            },
          ],
        },
      ],
    },
  },
  {
    // Unidirectional deps: features must not import upward (app/pages) or into other features.
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app', '@/app/*', '@/pages', '@/pages/*'],
              message: 'Features must not import from app/ or pages/ (deps flow shared → features → pages → app).',
            },
            {
              group: ['@/features/*/*'],
              message: 'Import another feature through its public API: @/features/<name>.',
            },
          ],
        },
      ],
    },
  },
  {
    // Composition roots: they compose every feature's i18n/mock modules by design,
    // so they're allowed to import feature internals directly.
    files: ['src/i18n/index.ts', 'src/mocks/handlers.ts'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    // Allow intentionally-unused args/vars when prefixed with _ (callback signatures, etc.)
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
])
