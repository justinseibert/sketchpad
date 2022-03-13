const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: './dist/tsc/browser.js',
	mode: 'production',
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
