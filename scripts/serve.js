
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");

function serve(webpackConfig) {
	var watchConfig = Object.create(webpackConfig);

	console.log(watchConfig.output);

	var serveStatic = require('serve-static')
	var path = require("path");

	var watchCompiler = webpack(watchConfig);
	// Start a webpack-dev-server
	var server = new WebpackDevServer(watchCompiler, {
		publicPath: watchConfig.output.publicPath,
		// hot: true,
		contentBase: watchConfig.devServer.contentBase,
		quiet: false,
		noInfo: false,
		stats: {
			colors: true
		}
	});

	server.listen(watchConfig.devServer.port, "localhost", function(err) {
		if (err) throw new Error("webpack-dev-server", err);
		console.log("[webpack-dev-server]", "http://localhost:" + watchConfig.devServer.port);
	});

	server.app.use(serveStatic(path.join(__dirname, "..", "node_modules")));
	server.app.use(serveStatic(path.join(__dirname, "..", "node_modules", "react-stockcharts-src")));
}

serve(require(process.argv[2]));
