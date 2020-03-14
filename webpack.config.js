const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [ 'ts-loader' ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      inject: false,
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  output: {
    filename: 'main.js',
    library: 'App',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
}
