const pkg = require('./package.json');

module.exports = {
  displayName: pkg.name,
  testMatch: ["**/__tests__/**/*.?(c)[jt]s", "**/?(*.)+(spec|test).?(c)[jt]s"],
  transform: {
    '\\.js': 'jest-esm-transformer'
  },
  testPathIgnorePatterns: [
    '<rootDir>/src/__tests__/setup.cjs',
    '<rootDir>/src/__tests__/__mocks__',
    '<rootDir>/src/__tests__/helpers',
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.cjs'],
};
