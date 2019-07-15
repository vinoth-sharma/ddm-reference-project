import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3'

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  @Input('barChartData') dataset: Array<{}>;
  @Input() barColor: string;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() selectorDiv: string;
  @Input() chartTitle: string;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.createBar()
    },0);
  }

  createBar() {
    
    var margin = { top: 40, right: 30, bottom: 30, left: 50 },
      width = document.getElementById(this.selectorDiv).clientWidth - margin.left - margin.right - 10,
      height = document.getElementById(this.selectorDiv).clientHeight - margin.top - margin.bottom -10;

    var barColor = this.barColor;

    var formatPercent = d3.format(".0%");

    var svg = d3.select("#barChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + 1.1* margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.4);
    var y = d3.scaleLinear()
      .range([height, 0]);

    var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
    var yAxis = d3.axisLeft(y).tickFormat(formatPercent);

    var dataset = this.dataset

    x.domain(dataset.map(d => {
      var key = Object.keys(d)[0];
      return d[key]
    }));

    y.domain([0, 1]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("x", (width))
      .attr("y", "-10px")
      .attr("dx", "1em")
      .style("text-anchor", "end")
      .style("fill", "gray")
      .text(this.xAxisLabel);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "gray")
      .text(this.yAxisLabel);

    svg.selectAll(".bar")
      .data(dataset)
      .enter().append("rect")
      .attr("class", "bar")
      .style("display", d => { return d.value === null ? "none" : null; })
      .style("fill", barColor)
      .attr("x", d => { 
        return x(d.year); })
      .attr("width", x.bandwidth())
      .attr("y", d => { return height; })
      .attr("height", 0)
      .transition()
      .duration(750)
      .delay(function (d, i) {
        return i * 150;
      })
      .attr("y", d => { return y(d.value); })
      .attr("height", d => { return height - y(d.value); });

    svg.selectAll(".label")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "label")
      .style("display", d => { return d.value === null ? "none" : null; })
      .attr("x", (d => { return x(d.year) + (x.bandwidth() / 2) - 8; }))
      .style("fill", barColor)
      .attr("y", d => { return height; })
      .attr("height", 0)
      .transition()
      .duration(750)
      .delay((d, i) => { return i * 150; })
      .text(d => { return formatPercent(d.value); })
      .attr("y", d => { return y(d.value) + .1; })
      .attr("dy", "-.7em");

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text(this.chartTitle);
  }
}
