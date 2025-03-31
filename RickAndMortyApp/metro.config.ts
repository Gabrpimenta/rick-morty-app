import { getDefaultConfig } from 'expo/metro-config';

const config = getDefaultConfig(__dirname);

const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

module.exports = wrapWithReanimatedMetroConfig(config);
