module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "react-native-reanimated/plugin",
    [
      "module-resolver",
      {
        extensions: [
          ".ios.ts",
          ".android.ts",
          ".ios.tsx",
          ".android.tsx",
          ".ts",
          ".tsx",
          ".tson",
          ".js",
          ".jsx",
        ],
        root: ["."],
        alias: {
          "@": ".",
        },
      },
    ],
    ["@babel/plugin-transform-private-methods", { loose: true }],
  ],
  overrides: [
    {
      test: "./node_modules/ethers",
      plugins: [
        [
          "@babel/plugin-transform-private-methods",
          {
            loose: true,
          },
        ],
      ],
    },
  ],
};
