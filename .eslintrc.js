module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  env: {
    node: true,
    es2021: true,
    browser: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['import'],
  rules: {
    '@typescript-eslint/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
  },
};
