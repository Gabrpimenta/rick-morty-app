import eslintJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default tseslint.config(
  // --- 1. Global Ignores ---
  {
    ignores: [
      'node_modules/',
      'android/',
      'ios/',
      'coverage/',
      'dist/',
      '.expo/',
      'babel.config.js',
      'metro.config.js',
      'prettier.config.cjs',
    ],
  },

  // --- 2. ESLint Recommended Base ---
  eslintJs.configs.recommended,

  // --- 3. TypeScript Configuration ---
  ...tseslint.configs.recommended,

  // --- 4. React Native Community Config (via FlatCompat) ---
  ...compat.extends('@react-native-community/eslint-config'),

  // --- 5. Import Plugin Configuration ---
  {
    plugins: { import: pluginImport },
    settings: {
      'import/parsers': { '@typescript-eslint/parser': [ '.ts', '.tsx' ] },
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
      },
    },
    rules: {
      'import/no-unresolved': 'error',
    },
  },

  // --- 6. Custom Rules & Overrides for TS/RN files ---
  {
    files: [ 'src/**/*.{ts,tsx}' ],
    languageOptions: {
      globals: {
        ...globals.browser,
        __DEV__: 'readonly',
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'warn',
      '@typescript-eslint/no-unused-vars': [ 'warn', { argsIgnorePattern: '^_' } ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // --- 7. Prettier Config (- MUST BE LAST) ---
  ...compat.extends('prettier')
);
