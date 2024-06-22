const { getDefaultConfig, mergeConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const os = require('node:os');
const path = require('node:path');

const config = getDefaultConfig(__dirname);

config.resetCache = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_enableSymlinks = true;

config.cacheStores = ({ FileStore }) => [
  new FileStore({
    root: path.join(os.homedir(), '.metro/cache'),
  }),
],

module.exports = withNativeWind(config, { input: './global.css' });