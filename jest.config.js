const { createConfig } = require('@edx/frontend-build');

const config = createConfig('jest', {
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTest.js',
  ],
});

module.exports = config;
