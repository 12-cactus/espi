module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
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
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'max-len': ['error', { code: 120 }],
    '@typescript-eslint/lines-between-class-members': 'off',
  },
};
