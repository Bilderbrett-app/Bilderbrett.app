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
          
          'libp2p': 'libp2p/dist/src',
          '@libp2p/websockets': '@libp2p/websockets/dist/src',
          '@libp2p/bootstrap': '@libp2p/bootstrap/dist/src',
          '@libp2p/identify': '@libp2p/identify/dist/src',
          '@libp2p/webrtc': '@libp2p/webrtc/dist/src',
          '@libp2p/kad-dht': '@libp2p/kad-dht/dist/src',
          '@libp2p/interface': '@libp2p/interface/dist/src',
          '@libp2p/circuit-relay-v2': '@libp2p/circuit-relay-v2/dist/src',
          '@libp2p/tcp': '@libp2p/tcp/dist/src',
          '@libp2p/peer-id': '@libp2p/peer-id/dist/src',
          '@libp2p/peer-record': '@libp2p/peer-record/dist/src',
          '@libp2p/crypto': '@libp2p/crypto/dist/src',
          'get-iterator': 'get-iterator/dist/src',
          '@chainsafe/libp2p-noise': '@chainsafe/libp2p-noise/dist/src',
          '@chainsafe/libp2p-yamux': '@chainsafe/libp2p-yamux/dist/src',
          '@chainsafe/libp2p-gossipsub': '@chainsafe/libp2p-gossipsub/dist/src',
        }
      }],
      "react-native-reanimated/plugin"
    ]
  };
};