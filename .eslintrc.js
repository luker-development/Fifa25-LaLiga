module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'eslint:recommended'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  settings: {
    next: {
      rootDir: ['apps/web']
    }
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-console': 'warn',
    'next/no-html-link-for-pages': 'off'
  }
};
