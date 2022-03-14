const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./dist/tsc/browser.js",
  mode: "production",
  output: {
    filename: "index.js",
    library: {
      name: "Metaball",
      type: "umd",
      export: "default",
    },
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
    extensions: [".js"],
  },
};
