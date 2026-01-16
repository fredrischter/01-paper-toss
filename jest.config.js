module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/game-all.js' // Exclude combined file
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  testTimeout: 30000, // Increased timeout for screenshot tests
  setupFilesAfterEnv: [],
  // Ignore puppeteer warnings in test output
  modulePathIgnorePatterns: ['<rootDir>/node_modules/']
};
