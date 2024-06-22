const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
console.log(defaultConfig);

const config = {
  resolver: {
    unstable_enablePackageExports: true,
  }
}

module.exports = withNativeWind(config, { input: './global.css' })