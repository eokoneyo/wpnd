const pkg = require('./package.json');

/** @type {import('jest').Config} */
const config = {
  displayName: pkg.name,
  testMatch: ["**/__tests__/**/*.?(c)[jt]s", "**/?(*.)+(spec|test).?(c)[jt]s"],
  transform: {},
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/setup.cjs',
    '<rootDir>/__tests__/__mocks__',
    '<rootDir>/__tests__/helpers',
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.cjs'],
};

module.exports = config
