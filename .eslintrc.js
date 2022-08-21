module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.lint.json',
  },
  rules: {
    'import/prefer-default-export': 'off',
  },
}
