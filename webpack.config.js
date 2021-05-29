const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
// const NodemonPlugin = require('nodemon-webpack-plugin');

const frontBundle = {
	entry: {
		main: './src/public/js/main.js',
	},

	output: {
		path: path.resolve(__dirname, 'dist', 'public'),
		filename: '[name].js',
	},

	module: {
		rules: [
			{
				test: /\.js$/i,
				// exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.html$/i,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: true,
							sources: {
								urlFilter: (attribute, value, resourcePath) => {
									if (/\/socket\.io\/socket\.io\.js$/.test(value)) {
										return false;
									}

									return true;
								},
							},
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: './src/public/index.html',
			filename: 'index.html',
		}),
		new MiniCssExtractPlugin(),
	],
};

const backBundle = {
	entry: {
		app: path.resolve(__dirname, 'src', 'index.js'),
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app-bundle.js',
	},

	target: 'node',

	externals: [nodeExternals()],

	module: {
		rules: [
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
};

module.exports = [frontBundle, backBundle];
