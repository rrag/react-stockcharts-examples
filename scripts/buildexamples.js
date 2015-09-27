var path = require("path");
var fs = require("fs");
var replaceStream = require("replacestream");

var renderChart = function(chartName, mode) {
	var tsvFile = mode === "DEV" ? "../docs/data/MSFT.tsv" : "//rrag.github.io/react-stockcharts/data/MSFT.tsv";
	var render = `
var parseDate = d3.time.format("%Y-%m-%d").parse;
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
	/* change the type from hybrid to svg to compare the performance between svg and canvas */
	ReactDOM.render(<TypeChooser type="hybrid">{type => <${ chartName } data={data} type={type} />}</TypeChooser>, document.getElementById("chart"));
});`
	return render;
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
	"CandleStickChartWithBollingerBandOverlay",
	"CandleStickChartWithRSIIndicator",
	"CandleStickChartWithFullStochasticsIndicator",
	"CandleStickChartWithUpdatingData",
];

var root = path.join(__dirname, "..");

var args = process.argv.slice(2);
var mode = args[0];

examplesToPublish.forEach(function (eachEx) {
	var source = path.join(root, "node_modules", "react-stockcharts-src", "docs", "lib", "charts", eachEx + ".jsx");
	fs.createReadStream(source)
		.pipe(replaceStream(/import .*/g, ""))
		.pipe(replaceStream(/var { ChartWidthMixin } = ReStock.helper;/, "var { ChartWidthMixin, TypeChooser } = ReStock.helper;"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/\n\n/, "\n"))
		.pipe(replaceStream(/export default .*/, renderChart(eachEx, mode)))
		.pipe(fs.createWriteStream(path.join(root, "examples", eachEx, eachEx + ".jsx")));


	fs.readFile(source, "utf8", function(err, data) {

		var height = parseInt(data.match(/<ChartCanvas .*? height=\{([^}]*)/)[1], 10);
		// console.log(err, eachEx, `${ height + 100 }px`);
		fs.createReadStream(path.join(root, "examples", "index." + mode + ".html"))
			.pipe(replaceStream(/CHART_NAME_HERE/g, eachEx))
			.pipe(replaceStream(/HEIGHT_HERE/g, `${ height + 100 }px`))
			.pipe(fs.createWriteStream(path.join(root, "examples", eachEx, "index.html")));
	})

});

