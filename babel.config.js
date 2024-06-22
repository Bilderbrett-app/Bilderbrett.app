module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo", 
        { jsxImportSource: "nativewind" }
      ],
      "@babel/plugin-transform-private-methods",
      "nativewind/babel"
    ],
    plugins: [
      "react-native-reanimated/plugin"
    ]
  };
};