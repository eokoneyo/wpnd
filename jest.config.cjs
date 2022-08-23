const pkg = require('./package.json');

module.exports = {
  displayName: pkg.name,
  testMatch: ["**/__tests__/**/*.?(c)[jt]s", "**/?(*.)+(spec|test).?(c)[jt]s"],
  transform: {
    '\\.js': 'jest-esm-transformer'
  },
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/setup.cjs',
    '<rootDir>/__tests__/__mocks__',
    '<rootDir>/__tests__/helpers',
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.cjs'],
};
