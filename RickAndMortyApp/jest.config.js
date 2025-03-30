module.exports = {
  preset: 'jest-expo', // Provides base config for RN/Expo, including node env & transformer

  // --- Setup & Mocks ---
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './jest.setup.js',
  ],

  // --- File Handling ---
  moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/.expo/',
    '/dist/',
  ],
  modulePathIgnorePatterns: [ '/node_modules/' ],

  // --- Module Resolution (Path Aliases) ---
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // --- Coverage ---
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/types/**/*',
    '!src/**/index.ts',
    '!src/navigation/**/*',
    '!src/providers/**/*',
    '!src/config/**/*',
    '!src/store/index.ts',
    '!src/store/rootReducer.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [ 'text', 'lcov', 'clover', 'json-summary' ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};