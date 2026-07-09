import { defineConfig } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import sql from 'eslint-plugin-sql';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: [
      ...compat.extends('eslint:recommended'),
      ...compat.extends('plugin:@typescript-eslint/recommended'),
      ...compat.extends('plugin:prettier/recommended'),
      ...compat.extends('plugin:react/recommended'),
      ...nextCoreWebVitals,
      ...nextTypescript,
    ],

    plugins: {
      '@typescript-eslint': typescriptEslint,
      sql,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      'comma-dangle': ['error', 'always-multiline'],

      'no-restricted-globals': [
        'error',
        {
          name: 'umami',
          message: 'Use logAnalytics instead.',
        },
      ],

      'react/no-unescaped-entities': [
        'error',
        {
          forbid: [
            {
              char: '>',
              alternatives: ['&gt;'],
            },
            {
              char: '}',
              alternatives: ['&#125;'],
            },
          ],
        },
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['.*'],
              message:
                'Please use an absolute import with @/ instead of relative imports.',
            },
            {
              group: ['@radix-ui/*'],
              message:
                'Please use our wrapper components in @/components/ui instead.',
            },
          ],

          paths: [
            {
              name: 'pg',
              message: 'Please use postgres instead.',
            },
            {
              name: '@/database/generatedDbTypes',
              message: 'Please use @/database/allDbTypes instead.',
            },
            {
              name: 'slugify',
              message: 'Please use @/logic/toSlug instead.',
            },
            {
              name: 'react-markdown',
              message: 'Please use @/componentsMarkdown instead.',
            },
            {
              name: 'react-intersection-observer',
              message: 'Please use @/hooks/useIntersectionObserver instead.',
            },
          ],
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'sql/format': [
        2,
        {
          sqlTag: 'sql',
        },
        {
          language: 'postgresql',
          keywordCase: 'upper',
          dataTypeCase: 'upper',
        },
      ],

      'sql/no-unsafe-query': [
        2,
        {
          sqlTag: 'sql',
        },
      ],

      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
        },
      ],
    },
  },
]);
