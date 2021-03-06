const {
	mode
} = require("webpack-nano/argv");
const {
	merge
} = require("webpack-merge");
const parts = require("./webpack.parts");

const cssLoaders = [parts.autoprefix(), parts.tailwind()];

const commonConfig = merge([{
		entry: ["./src"]
	},
	parts.page({
		title: "Demo"
	}),
	parts.extractCSS({
		loaders: cssLoaders
	}),
	parts.loadImages({ limit: 15000 }),
	parts.loadJavaScript(),
]);

const productionConfig = merge([parts.eliminateUnusedCSS()]);

const developmentConfig = merge([{
		entry: ["webpack-plugin-serve/client"]
	},
	parts.devServer(),
]);

const getConfig = (mode) => {
	switch (mode) {
		case "production":
			return merge(commonConfig, productionConfig, {
				mode
			});
		case "development":
			return merge(commonConfig, developmentConfig, {
				mode
			});
		default:
			return merge(commonConfig, {
				mode
			})
	}
};

module.exports = getConfig(mode);