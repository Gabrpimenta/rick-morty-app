module.exports = {
  preset: 'jest-expo',

  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './jest.setup.js',
  ],

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
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|@shopify/react-native-skia|expo(nent)?|@expo(nent)?/.*|react-native-reanimated|react-native-gesture-handler|react-redux)',
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

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
    '!src/constants/**/*',
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
