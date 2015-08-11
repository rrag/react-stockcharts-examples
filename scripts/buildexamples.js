var path = require("path");
var fs = require("fs");
var replaceStream = require("replacestream");

var getFunctionFor = function(chartName, mode) {
	var tsvFile = mode === "DEV" ? "\"../../data/MSFT.tsv\"" : "\"//rrag.github.io/react-stockcharts/data/MSFT.tsv\"";
	/*eslint-disable */
	var r = 'var parseDate = d3.time.format("%Y-%m-%d").parse;' + "\n" +
	"d3.tsv(" + tsvFile + ", (err, data) => {" + "\n" +
	"	/* change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points */" + "\n" +
	"	data.forEach((d, i) => {" + "\n" +
	"		d.date = new Date(parseDate(d.date).getTime());"+ "\n" +
	"		d.open = +d.open;"+ "\n" +
	"		d.high = +d.high;"+ "\n" +
	"		d.low = +d.low;"+ "\n" +
	"		d.close = +d.close;"+ "\n" +
	"		d.volume = +d.volume;"+ "\n" +
	"		// console.log(d);"+ "\n" +
	"	});"+ "\n" +
	'	React.render(<' + chartName + ' data={data} />, document.getElementById("chart"));'+ "\n" +
	"});"
	/*eslint-enable */
	return r;
};

var examplesToPublish = ["AreaChart",
	"CandleStickChart",
	"CandleStickStockScaleChart",
	"CandleStickStockScaleChartWithVolumeHistogramV1",
	"CandleStickStockScaleChartWithVolumeHistogramV2",
	"CandleStickStockScaleChartWithVolumeHistogramV3",
	"CandleStickChartWithCHMousePointer",
	"CandleStickChartWithZoomPan",
	"CandleStickChartWithMA",
	"CandleStickChartWithEdge",
	"CandleStickChartWithMACDIndicator",
	"CandleStickChartWithMACDIndicatorCanvas", // comment this later
	"HaikinAshi",
	"Kagi",
	"PointAndFigure",
	"Renko"
];

var root = path.join(__dirname, "..");

var args = process.argv.slice(2);
var mode = args[0];

examplesToPublish.forEach(function (eachEx) {
	fs.createReadStream(path.join(root, "node_modules", "react-stockcharts", "docs", "lib", "charts", eachEx + ".jsx"))
		.pipe(replaceStream(/var React = .*/, ""))
		.pipe(replaceStream(/var d3 = .*/, ""))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/var ReStock = .*/, ""))
		.pipe(replaceStream(/module.exports = .*/, getFunctionFor(eachEx, mode)))
		.pipe(fs.createWriteStream(path.join(root, "examples", eachEx, eachEx + ".jsx")));

	fs.createReadStream(path.join(root, "index." + mode + ".html"))
		.pipe(replaceStream(/CHART_NAME_HERE/g, eachEx))
		.pipe(fs.createWriteStream(path.join(root, "examples", eachEx, "index.html")));
});

