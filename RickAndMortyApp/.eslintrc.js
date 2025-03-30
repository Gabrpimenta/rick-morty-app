module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    // --- Prettier ---
    'prettier/prettier': [ 'error', {}, { usePrettierrc: true } ],

    // --- React/RN Specific ---
    'react-native/no-inline-styles': 'warn',
    'react/prop-types': 'off',

    // --- TypeScript Specific ---
    '@typescript-eslint/no-unused-vars': [ 'warn', { argsIgnorePattern: '^_' } ], // Warn on unused vars, allow underscore prefix
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow functions without explicit return types (preference)

    // --- Import Plugin ---
    'import/order': [ // Enforce consistent import order
      'warn', // Use warn instead of error during development
      {
        groups: [ 'builtin', 'external', 'internal', [ 'parent', 'sibling' ], 'index', 'object', 'type' ],
        pathGroups: [ // Custom grouping for project aliases
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: [ 'react', 'react-native' ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-unresolved': 'error', // Catches unresolved imports
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // Always try resolving @types/* modules
        project: './tsconfig.json', // Point to your tsconfig
      },
    },
    'import/parsers': { // Ensure TS parser is used for import plugin
      '@typescript-eslint/parser': [ '.ts', '.tsx' ]
    },
  },
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    'coverage/',
    'dist/',
    '.expo/',
    'babel.config.js',
    'metro.config.js',
    'jest.config.js',
    'jest.setup.js',
  ],
};