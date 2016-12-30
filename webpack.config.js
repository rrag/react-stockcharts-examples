var webpack = require("webpack");
var path = require("path");

module.exports = {
	context: __dirname,
	entry: {
		app: path.join(__dirname, "node_modules/react-stockcharts-src/src/index.js"),
	},
	devtool: "sourcemap",
	output: {
		path: path.join(__dirname, "build/dist/"),
		filename: "react-stockcharts.js",
		publicPath: "http://localhost:8090/js/",
		library: "ReStock",
		libraryTarget: "umd",
	},
	module: {
		loaders: [
			{ test: /\.(js|jsx)$/, loaders: ["babel-loader"], exclude: /node_modules/ },
		]
	},
	devServer: {
		contentBase: path.join(__dirname, "examples"),
		port: 8090,
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
	],
	externals: {
		"react": "React",
		"react-dom": "ReactDOM",
		"d3": "d3",
	},
	resolve: {
		// root: [__dirname, path.join(__dirname, "src"), path.join(__dirname, "docs")],
		extensions: [".js", ".jsx", ".scss", ".md"]
	}
};
