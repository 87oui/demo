import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import configGitignore from 'eslint-config-flat-gitignore'
import configPrettier from 'eslint-config-prettier'
import pluginAstro from 'eslint-plugin-astro'
import pluginImport from 'eslint-plugin-import'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  // .gitignoreを参照
  configGitignore(),
  // JavaScript, TypeScript
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  // TypeScript
  tseslint.configs.recommended,
  // React
  {
    files: ['**/*.{jsx,tsx}'],
    ...pluginReact.configs.flat.recommended,
    ...pluginReact.configs.flat['jsx-runtime'],
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  // Astro
  ...pluginAstro.configs.recommended,
  ...pluginAstro.configs['jsx-a11y-recommended'],
  // Common
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      import: pluginImport,
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
      'import/core-modules': ['astro:assets', 'astro:transitions'],
    },
    rules: {
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  // Prettier
  configPrettier,
])
