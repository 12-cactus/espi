import js from '@eslint/js';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '.git/**',
      'logs/**',
      'jest.config.js',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        sourceType: 'module',
        ecmaVersion: 2024,
      },
      globals: globals.node,
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
      import: importPlugin,
    },
    settings: {
      'import/extensions': ['.js', '.ts'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.js', '.ts'],
      },
      'import/resolver': {
        node: {
          extensions: ['.d.ts', '.ts'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.eslint.json',
        },
      },
    },
    rules: {
      // Disable the base rule and use TS version
      'no-unused-vars': 'off',
      // TypeScript ESLint recommended rules
      '@typescript-eslint/eslint-recommended': 'off',
      '@typescript-eslint/explicit-function-return-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],
      // Import rules
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: true,
          ignoreDeclarationSort: true,
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'ignore',
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts', '**/*.test.js'] }],
    },
  },
  // Jest test files configuration
  {
    files: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.js'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  // Prettier override - must be last
  prettier,
];
