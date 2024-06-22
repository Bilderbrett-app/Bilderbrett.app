const { getDefaultConfig, mergeConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    unstable_enablePackageExports: true,
  }
};

module.exports = withNativeWind(mergeConfig(defaultConfig, config), { input: './global.css' })