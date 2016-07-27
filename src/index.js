
"use strict";
import ReStock from "react-stockcharts";
import React from "react";
import ReactDOM from "react-dom";
import d3 from "d3";

var { ChartCanvas, Chart } = ReStock;

var { CandlestickSeries } = ReStock.series;
var { XAxis, YAxis } = ReStock.axes;
var { fitWidth, TypeChooser } = ReStock.helper;

class ChartViz extends React.Component {
	render() {
		const {type, width, data} = this.props;
		return (
		<ChartCanvas width={width} height={400}
					margin={{left: 0, right: 0, top:25, bottom: 30}} type={type}
					data={data}
					seriesName='CandleStick'
					xAccessor={d => d.date} xScale={d3.time.scale()}>

				<Chart id={1} yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6} stroke="none" tickStroke="#9E9E9E"/>
					<YAxis axisAt="left" orient="right" ticks={10} stroke="none" tickStroke="#9E9E9E"/>
					<CandlestickSeries fill={d => d.close > d.open ? "#32c2b0" : "#EDB24E"}/>
				</Chart>
			</ChartCanvas>
		);
	}
}

var parseDate = d3.time.format("%Y-%m-%d").parse;
d3.tsv("docs/data/MSFT.tsv", (err, data) => {
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

	ChartViz = fitWidth(ChartViz);
	ReactDOM.render(<ChartViz data={data} type="hybrid"/>, document.getElementById("chart"));

	/*setTimeout(function () {
		var chartData = data.slice(0, i);
		i++;
		console.log("here")
		ReactDOM.render(<Chart data={data} type="svg"/>, document.getElementById("chart"));
	}, 1000);*/
});