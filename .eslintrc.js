module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
  overrides: [{
    files: ['api/src/methods/**/index.js'],
    rules: {
      'global-require': false,
    },
  }],
};
