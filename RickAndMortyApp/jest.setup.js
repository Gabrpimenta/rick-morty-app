import 'react-native-gesture-handler/jestSetup';

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// --- Mock Reanimated ---
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();
// --- Mock Skia ---
// Skia relies heavily on native code, so we need to mock its components and hooks
jest.mock('@shopify/react-native-skia', () => {
  const React = require('react');
  const actualSkia = jest.requireActual('@shopify/react-native-skia');

  const createMockComponent = (name) => (props) => React.createElement(`mock-${name}`, props, props.children);

  return {
    ...actualSkia,
    Canvas: createMockComponent('Canvas'),
    Rect: createMockComponent('Rect'),
    RoundedRect: createMockComponent('RoundedRect'),
    Text: createMockComponent('Text'),
    Image: createMockComponent('Image'),
    Group: createMockComponent('Group'),
    Paint: createMockComponent('Paint'),
    LinearGradient: createMockComponent('LinearGradient'),
    Mask: createMockComponent('Mask'),

    useFont: jest.fn().mockReturnValue({}),
    useImage: jest.fn().mockReturnValue(null),
    Skia: {
      ...actualSkia.Skia,
      FontMgr: {
        RefDefault: () => ({
          matchFamilyStyle: jest.fn().mockReturnValue({}),
        }),
      },
      Matrix: jest.fn(() => {
        const matrixMock = {
          identity: jest.fn(() => matrixMock),
          translate: jest.fn(() => matrixMock),
          scale: jest.fn(() => matrixMock),
          rotate: jest.fn(() => matrixMock),
          skew: jest.fn(() => matrixMock),
          invert: jest.fn(() => matrixMock),
          multiply: jest.fn(() => matrixMock),
        };
        return matrixMock;
      }),
      Path: {
        Make: jest.fn(() => ({
          moveTo: jest.fn(),
          lineTo: jest.fn(),
          close: jest.fn(),
        }))
      }
    },
  };
});

// --- Mock Expo SQLite ---
jest.mock('expo-sqlite', () => ({
  openDatabase: jest.fn((dbName) => ({
    transaction: jest.fn((callback, errorCallback, successCallback) => {
      const mockTx = {
        executeSql: jest.fn((sqlStatement, args, successCb, errorCb) => {
          if (typeof successCb === 'function') {
            const mockResultSet = {
              rows: { _array: [], length: 0 },
              rowsAffected: 0,
              insertId: undefined,
            };
            successCb(mockTx, mockResultSet);
          }
        }),
      };
      try {
        callback(mockTx);
        if (typeof successCallback === 'function') {
          successCallback();
        }
      } catch (err) {
        if (typeof errorCallback === 'function') {
          errorCallback(err);
        }
      }
    }),
  })),
}));

// --- Mock other native modules or libraries ---
jest.mock('expo-font', () => ({
  loadAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');

jest.mock('react-native-svg', () => {
  const React = require('react');
  const createMockSvgComponent = (name) => (props) => React.createElement(name, props, props.children);
  return {
    __esModule: true,
    default: createMockSvgComponent('Svg'),
    Svg: createMockSvgComponent('Svg'),
    Rect: createMockSvgComponent('Rect'),
    Circle: createMockSvgComponent('Circle'),
    Path: createMockSvgComponent('Path'),
    Defs: createMockSvgComponent('Defs'),
    LinearGradient: createMockSvgComponent('LinearGradient'),
    Stop: createMockSvgComponent('Stop'),
  };
});
