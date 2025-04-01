// Learn more https://docs.expo.io/guides/customizing-metro
const { mergeConfig } = require("metro-config");
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = {
  watchFolders: [path.resolve(__dirname + "/.")],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
