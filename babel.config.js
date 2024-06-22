module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo", 
        { jsxImportSource: "nativewind" }
      ],
      "nativewind/babel",
    ],
    plugins: [
      [
        '@babel/plugin-transform-private-methods', 
        { loose: true }
      ],
      ['module-resolver', {
        alias: {
          'crypto': 'react-native-quick-crypto',
          'node:crypto': 'react-native-quick-crypto',
          'stream': 'stream-browserify',
          'node:stream': 'stream-browserify',
          'net': 'react-native-tcp-socket',
          'node:net': 'react-native-tcp-socket',
          'os': 'os-browserify',
          'node:os': 'os-browserify',
          'path': 'path-browserify',
          'node:path': 'path-browserify',
          'process': 'react-native-process-shim',
          'node:process': 'react-native-process-shim',
          'libp2p': 'libp2p/dist/index.min.js',
          '@libp2p/websockets': '@libp2p/websockets/dist/index.min.js',
          '@libp2p/bootstrap': '@libp2p/bootstrap/dist/index.min.js',
          '@chainsafe/libp2p-noise': '@chainsafe/libp2p-noise/dist/index.min.js',
          '@chainsafe/libp2p-yamux': '@chainsafe/libp2p-yam/dist/index.min.js',
        }
      }],
      "react-native-reanimated/plugin"
    ]
  };
};