module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    jest: true,
    es6: true,
  },
  // https://github.com/airbnb/javascript
  extends: [
    'airbnb-base',
    'plugin:lit/recommended',
  ],
  // required to lint *.lit files
  plugins: [
    'html',
    'lit',
  ],
  // add your custom rules here
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'consistent-return': 'warn',
    'no-param-reassign': 'off',
    'linebreak-style': 'off',
    'no-useless-computed-key': 'off',
    'no-unused-expressions': ['error', { allowTernary: true }],
    'max-len': ['error', { code: 400 }],
    'max-classes-per-file': 'off',
  },
  overrides: [
    {
      files: ['src/**/*.js'],
      excludedFiles: 'src/fusion/**/*.js',
      rules: {
        'max-classes-per-file': 'warn',
        'arrow-parens': 'warn',
        'no-multiple-empty-lines': 'warn',
        'no-mixed-operators': 'warn',
      },
    },
  ],
  globals: {
    com: true,
  },
};
