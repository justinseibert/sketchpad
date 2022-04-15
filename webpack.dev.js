const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    hot: true,
  },
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
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
  output: {
    filename: 'bundle.js',
    library: {
      name: 'App',
      type: 'umd',
      export: 'default',
    },
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
  },
  plugins: [
    new htmlWebpackPlugin({
      inject: false,
      template: path.resolve(__dirname, 'public/index.html'),
    }),
  ],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
    },
    extensions: [ '.ts', '.js' ],
  },
}
