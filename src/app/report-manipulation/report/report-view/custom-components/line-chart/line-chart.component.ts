import { Component, OnInit, ViewEncapsulation, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LineChartComponent implements OnInit {
  d3: any = d3;
  @Input('lineChartData') dataset: Array<{}>;
  @Input() lineColor: string;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() xAxisColumn: string;
  @Input() yAxisColumn: string;
  @Input() selectorDiv: string;
  @Input() chartTitle: string;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    this.createLineChart();
  }

  createLineChart() {

    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width = document.getElementById(this.selectorDiv).clientWidth - margin.left - margin.right - 10,
      height = document.getElementById(this.selectorDiv).clientHeight - margin.top - margin.bottom - 10;

    var xScale = this.d3.scaleBand()
      .range([0, width])
      .domain(this.dataset.map(d => {
        return d[this.xAxisColumn]
      }));

    var yRangeArray = this.dataset.map(d => {
      return d[this.yAxisColumn];
    })
    var yScale = this.d3.scaleLinear()
      .domain([
        Math.min(...yRangeArray), Math.max(...yRangeArray)
      ])
      .range([height, 0]);

    var xAxisColumn = this.xAxisColumn;
    var yAxisColumn = this.yAxisColumn;
    var line = this.d3.line()
      .x(function (d, i) {
        return xScale(d[xAxisColumn]);
      })
      .y(function (d) {
        return yScale(d[yAxisColumn]);
      })
      .curve(this.d3.curveMonotoneX)

    var svg = this.d3.select("#lineChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(this.d3.axisBottom(xScale))
      .selectAll("text")
      .call(wrap,xScale.bandwidth())
      .append("text")
      .attr("x", (width))
      .attr("y", "-10px")
      .attr("dx", "1em")
      .style("text-anchor", "end")
      .style("fill", "gray")
      .text(this.xAxisLabel);

    svg.append("g")
      .attr("class", "y axis")
      .call(this.d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "gray")
      .text(this.yAxisLabel);

    svg.append("path")
      .datum(this.dataset)
      .attr("class", "line")
      .attr("d", line)
      .style("stroke", this.lineColor)
      .transition()

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text(this.chartTitle);

    svg.selectAll(".dot")
      .data(this.dataset)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", function (d, i) { return xScale(d[xAxisColumn]) })
      .attr("cy", function (d) { return yScale(d[yAxisColumn]) })
      .attr("r", 5)
      .style("fill", this.lineColor)
      .on("mouseover", function (a) {
        console.log(a)
      })
      .on("mouseout", function () { })

  }

}

function wrap(text, width) {
  text.each(function() {
  var text = d3.select(this),
  words = text.text().split(/\s+/).reverse(),
  word,
  line = [],
  lineNumber = 0,
  lineHeight = 1.1, // ems
  y = text.attr("y"),
  dy = parseFloat(text.attr("dy")),
  tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
  while (word = words.pop()) {
  line.push(word);
  tspan.text(line.join(" "));
  if (tspan.node().getComputedTextLength() > width) {
  line.pop();
  tspan.text(line.join(" "));
  line = [word];
  tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
  }
  }
  });
 }