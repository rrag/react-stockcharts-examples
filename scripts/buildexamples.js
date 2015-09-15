var path = require("path");
var fs = require("fs");
var replaceStream = require("replacestream");

var getFunctionFor = function(chartName, mode) {
	var tsvFile = mode === "DEV" ? "../docs/data/MSFT.tsv" : "//rrag.github.io/react-stockcharts/data/MSFT.tsv";
	var r = `var parseDate = d3.time.format("%Y-%m-%d").parse;
d3.tsv("${ tsvFile }", (err, data) => {
	/* change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points */
	data.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});
	/* change the type from svg to hybrid to see how it works with canvas + svg */
	React.render(<${ chartName } data={data} type=\"svg\"/>, document.getElementById(\"chart\"));
});`
	return r;
};

var examplesToPublish = ["AreaChart",
	"CandleStickChart",
	"CandleStickChartWithCHMousePointer",
	"CandleStickChartWithEdge",
	"CandleStickChartWithMA",
	"CandleStickChartWithMACDIndicator",
	"CandleStickChartWithZoomPan",
	"CandleStickStockScaleChart",
	"CandleStickStockScaleChartWithVolumeHistogramV1",
	"CandleStickStockScaleChartWithVolumeHistogramV2",
	"CandleStickStockScaleChartWithVolumeHistogramV3",
	"HaikinAshi",
	"Kagi",
	"PointAndFigure",
	"Renko",
];

var root = path.join(__dirname, "..");

var args = process.argv.slice(2);
var mode = args[0];

examplesToPublish.forEach(function (eachEx) {
	fs.createReadStream(path.join(root, "node_modules", "react-stockcharts-src", "docs", "lib", "charts", eachEx + ".jsx"))
		.pipe(replaceStream(/import .*/g, ""))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/export default .*/, getFunctionFor(eachEx, mode)))
		.pipe(fs.createWriteStream(path.join(root, "examples", eachEx, eachEx + ".jsx")));

	fs.createReadStream(path.join(root, "examples", "index." + mode + ".html"))
		.pipe(replaceStream(/CHART_NAME_HERE/g, eachEx))
		.pipe(fs.createWriteStream(path.join(root, "examples", eachEx, "index.html")));
});

