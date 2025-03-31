/* eslint-disable @typescript-eslint/no-var-requires */
import 'react-native-gesture-handler/jestSetup';

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
    Circle: createMockComponent('Circle'),
    useFont: jest.fn().mockReturnValue({}),
    useImage: jest.fn().mockReturnValue(null),
    useFonts: jest.fn().mockReturnValue({}),
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
          rotateX: jest.fn(() => matrixMock),
          rotateY: jest.fn(() => matrixMock),
          concat: jest.fn(() => matrixMock),
        };
        return matrixMock;
      }),
    },
    matchFont: jest.fn().mockReturnValue({})
  };
});

jest.mock('expo-sqlite', () => {
  const mockDb = {
    execAsync: jest.fn().mockResolvedValue([]),
    runAsync: jest.fn().mockResolvedValue({ changes: 0, lastInsertRowId: 0 }),
    getFirstAsync: jest.fn().mockResolvedValue(null),
    getAllAsync: jest.fn().mockResolvedValue([]),
    getEachAsync: jest.fn(),
    closeAsync: jest.fn().mockResolvedValue(undefined),
    isInTransactionAsync: jest.fn().mockResolvedValue(false),
    withTransactionAsync: jest.fn(async (callback) => { await callback(); }),
  };
  return {
    openDatabaseSync: jest.fn(() => mockDb),
  };
});

jest.mock('expo-font', () => ({
  loadAsync: jest.fn().mockResolvedValue(undefined),
  useFonts: jest.fn().mockReturnValue([ true, null ]),
}));

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn().mockResolvedValue({
    isConnected: true,
    isInternetReachable: true,
  }),
}));

jest.mock('react-native/Libraries/AppState/AppState', () => ({
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  currentState: 'active',
}));
