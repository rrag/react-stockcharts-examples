
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("../webpack.config.js");
var watchConfig = Object.create(webpackConfig);

var serveStatic = require('serve-static')
var path = require("path");

var watchCompiler = webpack(watchConfig);
// Start a webpack-dev-server
var server = new WebpackDevServer(watchCompiler, {
	publicPath: watchConfig.output.publicPath,
	// hot: true,
	quiet: false,
	noInfo: false,
	stats: {
		colors: true
	}
});

server.listen(8090, "localhost", function(err) {
	if (err) throw new Error("webpack-dev-server", err);
	console.log("[webpack-dev-server]", "http://localhost:8090/");
});

server.app.use(serveStatic(path.join(__dirname, "..", "node_modules")));
server.app.use(serveStatic(path.join(__dirname, "..")));
server.app.use(serveStatic(path.join(__dirname, "..", "node_modules", "react-stockcharts", "docs")));
