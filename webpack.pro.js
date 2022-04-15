const path = require("path");
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  devtool: "inline-source-map",
  entry: "./dist/tsc/index.js",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          miniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  output: {
    filename: "bundle.js",
    library: {
      name: "App",
      type: "umd",
      export: "default",
    },
    path: path.resolve(__dirname, "dist/src"),
    publicPath: "",
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new miniCssExtractPlugin(),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
    extensions: [".ts", ".js"],
  },
};
