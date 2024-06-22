module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo", 
        { 
          jsxImportSource: "nativewind"
        }
      ],
      "nativewind/babel",
      require.resolve("expo-router/babel")
    ],
  };
};