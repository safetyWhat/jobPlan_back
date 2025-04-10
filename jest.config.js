module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./setupTests.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true,
};