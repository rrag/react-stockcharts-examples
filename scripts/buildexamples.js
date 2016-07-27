
var path = require("path");
var fs = require("fs");
var replaceStream = require("replacestream");

var root = path.join(__dirname, "..");

var args = process.argv.slice(2);
var mode = args[0];


var examplesToPublish_TSV = [
	"AreaChart",
	"CandleStickChart",
	"CandleStickChartWithCHMousePointer",
	"CandleStickChartWithEdge",
	"CandleStickChartWithMA",
	"CandleStickChartWithMACDIndicator",
	"CandleStickChartWithZoomPan",
	"CandleStickStockScaleChart",
	"CandleStickStockScaleChartWithVolumeBarV1",
	"CandleStickStockScaleChartWithVolumeBarV2",
	"CandleStickStockScaleChartWithVolumeBarV3",
	"HaikinAshi",
	"Kagi",
	"PointAndFigure",
	"Renko",
	"CandleStickChartWithBollingerBandOverlay",
	"CandleStickChartWithRSIIndicator",
	"CandleStickChartWithFullStochasticsIndicator",
	"CandleStickChartWithDarkTheme",
	"CandleStickChartWithClickHandlerCallback",
	"CandleStickChartWithBrush",
	"LineAndScatterChart",
	"CandleStickChartWithForceIndexIndicator",
	"OHLCChartWithElderRayIndicator",
	"OHLCChartWithElderImpulseIndicator",
	"CandleStickChartWithInteractiveIndicator",
	"CandleStickChartWithFibonacciInteractiveIndicator",

	"CandleStickChartWithAnnotation",
	"CandleStickChartWithHoverTooltip",
	"VolumeProfileChart",
	"VolumeProfileBySessionChart",
	"MovingAverageCrossOverAlgorithmV1",
	"MovingAverageCrossOverAlgorithmV2",
];

var examplesToPublish_ContinuousIntraday = [
	"CandleStickChartForContinuousIntraDay",
];

var examplesToPublish_DiscontinuousIntraday = [
	"CandleStickChartForDiscontinuousIntraDay",
];
//	"CandleStickChartWithUpdatingData",

var examplesToPublish_TSV_Compare = [
	"CandleStickChartWithCompare"
]

var examplesToPublish_Bubble = [
	"BubbleChart",
];

var examplesToPublish_Bar = [
	"BarChart",
];

var examplesToPublish_GroupedBar = [
	"GroupedBarChart",
	"StackedBarChart",
];
var examplesToPublish_HorizontalBar = [
	"HorizontalBarChart",
];
var examplesToPublish_HorizontalStackedBar = [
	"HorizontalStackedBarChart",
];

examplesToPublish_TSV.forEach(writeChart(renderChartWithOHLCData()));

examplesToPublish_ContinuousIntraday.forEach(writeChart(renderChartWithOHLCData("bitfinex_xbtusd_1m.csv", "csv")));
examplesToPublish_DiscontinuousIntraday.forEach(writeChart(renderChartWithOHLCData("MSFT_INTRA_DAY.tsv")));

examplesToPublish_TSV_Compare.forEach(writeChart(renderChartWithOHLCData("comparison.tsv")));
examplesToPublish_Bubble.forEach(writeChart(renderChartWithFile("bubble.json")));
examplesToPublish_Bar.forEach(writeChart(renderChartWithFile("barData.json")));
examplesToPublish_GroupedBar.forEach(writeChart(renderChartWithFile("groupedBarData.json")));
// examplesToPublish_HorizontalBar.forEach(writeChart(renderChartWithBubbleData));
// examplesToPublish_HorizontalStackedBar.forEach(writeChart(renderChartWithBubbleData));

function renderChartWithOHLCData(fileName, dataType) {
	var file = fileName || "MSFT.tsv"
	dataType = dataType || "tsv";

	var comment = !!fileName
		? ""
		: "/* change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points */"
	return (chartName, mode) => {
		var tsvFile = mode === "DEV" ? `../docs/data/${file}` : `//rrag.github.io/react-stockcharts/data/${file}`;
		var render = `
var parseDate = d3.time.format("%Y-%m-%d").parse;
d3["${dataType}"]("${tsvFile}", (err, data) => {
	${comment}
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
};

function renderChartWithFile(fileName, dataType) {
	dataType = dataType || "json";
	return (chartName, mode) => {
		var inputFile = mode === "DEV" ? `../docs/data/${fileName}` : `//rrag.github.io/react-stockcharts/data/${fileName}`;
		var render = `
d3["${dataType}"]("${ inputFile }", (err, data) => {
	ReactDOM.render(<TypeChooser type="hybrid">{type => <${ chartName } data={data} type={type} />}</TypeChooser>, document.getElementById("chart"));
});`
		return render;
	};
}

function writeChart(chartRenderer) {
	return (eachEx) => {
		var source = path.join(root, "node_modules", "react-stockcharts-src", "docs", "lib", "charts", eachEx + ".jsx");
		fs.createReadStream(source)
			.pipe(replaceStream(/var { fitWidth } = ReStock.helper;/, "var { fitWidth, TypeChooser } = rs.helper;"))
			.pipe(replaceStream(/ReStock/g, "rs"))
			.pipe(replaceStream(/import rs .*/g, "var rs = ReStock.default;"))
			.pipe(replaceStream(/import .*/g, ""))
			.pipe(replaceStream(/\n\n/, "\n"))
			.pipe(replaceStream(/\n\n/, "\n"))
			.pipe(replaceStream(/\n\n/, "\n"))
			.pipe(replaceStream(/\n\n/, "\n"))
			.pipe(replaceStream(/\n\n/, "\n"))
			.pipe(replaceStream(/export default .*/, chartRenderer(eachEx, mode)))
			.pipe(fs.createWriteStream(path.join(root, "examples", eachEx, eachEx + ".jsx")));

		fs.readFile(source, "utf8", function(err, data) {

			var height = (parseInt(data.match(/<ChartCanvas .*? height=\{([^}]*)/)[1], 10) + 20);
			console.log(err, eachEx, `${ height }px`);
			fs.createReadStream(path.join(root, "examples", "index." + mode + ".html"))
				.pipe(replaceStream(/CHART_NAME_HERE/g, eachEx))
				.pipe(fs.createWriteStream(path.join(root, "examples", eachEx, "index.html")));

			fs.createReadStream(path.join(root, "examples", ".block"))
				.pipe(replaceStream(/HEIGHT_HERE/g, `${height}`))
				.pipe(fs.createWriteStream(path.join(root, "examples", eachEx, ".block")));
		})

	};
}


setTimeout(function () {
	var darkThemeIndexSrc = path.join(root, "examples", "CandleStickChartWithDarkTheme", "index.html");
	var darkThemeIndexTarget = path.join(root, "examples", "CandleStickChartWithDarkTheme", "index.html.target");
	fs.createReadStream(darkThemeIndexSrc)
		.pipe(replaceStream("</head>",
`  <style>
      body {
        background: #303030;
      }
      .react-stockcharts-tooltip {
        fill: white;
      }
      .react-stockcharts-tooltip-label {
        fill: yellow;
      }
    </style>
  </head>`))
		.pipe(fs.createWriteStream(darkThemeIndexTarget));

	fs.unlink(darkThemeIndexSrc, function(err) {
		console.log("Deleted", err);
	});
	fs.renameSync(darkThemeIndexTarget, darkThemeIndexSrc)
}, 1000);