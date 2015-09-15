var webpack = require("webpack");
var path = require("path");

var config = require("./webpack.config.js");

config.entry = {
	app: path.join(__dirname, "src/index.js"),
};
config.output = {
	path: path.join(__dirname, "build/dist/"),
	filename: "bundle.js",
	publicPath: "js",
};

config.devServer.contentBase = path.join(__dirname, "src");

config.output.publicPath = "http://localhost:" + config.devServer.port + "/" + config.output.publicPath;

module.exports = config;
