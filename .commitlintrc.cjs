module.exports = {
  // "$schema": "https://json.schemastore.org/commitlintrc", // json
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, 'always', 72],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'chore',
        'docs',
        'feat',
        'fix',
        'pref',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
  },
};
