const {
	WebpackPluginServe
} = require("webpack-plugin-serve")
const {
	MiniHtmlWebpackPlugin,
} = require("mini-html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const glob = require("glob");
const PurgeCssPlugin = require("purgecss-webpack-plugin");

const ALL_FILES = glob.sync(path.join(__dirname, "src/*.js"));

exports.devServer = () => ({
	watch: true,
	plugins: [
		new WebpackPluginServe({
			host: "localhost",
			port: process.env.PORT || 8080,
			static: "./dist",
			liveReload: true,
			waitForBuild: true,
		}),
	],
});

exports.page = ({
	title
}) => ({
	plugins: [new MiniHtmlWebpackPlugin({
		context: {
			title
		}
	})],
});

exports.loadCSS = () => ({
	module: {
		rules: [{
			test: /\.css$/,
			use: ["style-loader", "css-loader"]
		}, ]
	}
})

exports.extractCSS = ({
	options = {},
	loaders = []
} = {}) => {
	return {
		module: {
			rules: [{
				test: /\.css$/,
				use: [{
						loader: MiniCssExtractPlugin.loader,
						options
					},
					"css-loader",
				].concat(loaders),
				sideEffects: true
			}, ],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: "[name].css",
			})
		]
	}
}

exports.tailwind = () => ({
	loader: "postcss-loader",
	options: {
		postcssOptions: {
			plugins: [require("tailwindcss")]
		}
	}
});

exports.eliminateUnusedCSS = () => ({
	plugins: [
		new PurgeCssPlugin({
			paths: ALL_FILES,
			extractors: [{
				extractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
				extensions: ["html"]
			}]
		})
	]
})

exports.autoprefix = () => ({
	loader: "postcss-loader",
	options: {
		postcssOptions: {
			plugins: [require("autoprefixer")]
		}
	}
})

exports.loadImages = ({
	limit
} = {}) => ({
	module: {
		rules: [{
			test: /\.(png|jpg)$/,
			type: "asset",
			parser: {
				dataUrlCondition: {
					maxSize: limit
				}
			}
		}]
	}
})

const APP_SOURCE = path.join(__dirname, "src");

exports.loadJavaScript = () => ({
	module: {
		rules: [
			// Consider extracting include as a parameter
			{
				test: /\.js$/,
				include: APP_SOURCE,
				use: "babel-loader"
			},
		]
	}
});