
"use strict";
import ReStock from "react-stockcharts";
import React from "react";
import d3 from "d3";

var { ChartCanvas, Chart, DataSeries } = ReStock;
var { CandlestickSeries } = ReStock.series;
var { XAxis, YAxis } = ReStock.axes;
var { ChartWidthMixin } = ReStock.helper;

var AreaChart = React.createClass({
	mixins: [ChartWidthMixin],
	propTypes: {
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	},
	render() {
		if (this.state === null || !this.state.width) return <div />;
		var { data, type } = this.props;
		return (
			<ChartCanvas width={this.state.width} height={400}
						 margin={{left: 35, right: 50, top:10, bottom: 30}}
						 data={data} type={type}>
			  <Chart id={1} xAccessor={(d) => d.date}>
				<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
				<YAxis axisAt="left" orient="left" ticks={5}/>
				<DataSeries id={0} yAccessor={CandlestickSeries.yAccessor}>
				  <CandlestickSeries />
				</DataSeries>
			  </Chart>
			</ChartCanvas>
		);
	}
});


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
	/* change the type from svg to hybrid to see how it works with canvas + svg */
	React.render(<AreaChart data={data} type="svg"/>, document.getElementById("chart"));
});