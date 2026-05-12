import { includeIgnoreFile } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import next from 'eslint-config-next';
import sqlPlugin from 'eslint-plugin-sql';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  { ignores: ['db-data/**', '.open-next/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends('plugin:prettier/recommended'),
  ...compat.extends('plugin:react/recommended'),
  ...next,
  {
    plugins: {
      sql: sqlPlugin,
    },
    rules: {
      'sql/format': [
        'error',
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
        'error',
        {
          sqlTag: 'sql',
        },
      ],
    },
  },
  {
    settings: {
      react: {
        version: '19.0',
      },
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
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
        },
      ],
    },
  },
]);
