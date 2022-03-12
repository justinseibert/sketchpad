const path = require('path')
const webpack = require('webpack')

module.exports = {
	devtool: 'inline-source-map',
	entry: ['./lib/index.js'],
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		library: {
			name: 'Collidicon',
			type: 'umd',
			export: 'default',
		},
		publicPath: '',
	},
	resolve: {
		alias: {
			src: path.resolve(__dirname, 'src'),
		},
		extensions: ['.ts', '.js'],
		fallback: {
			crypto: require.resolve('crypto-browserify'),
			buffer: require.resolve('buffer/'),
			stream: require.resolve('stream-browserify'),
		},
	},
}
