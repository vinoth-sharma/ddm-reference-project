import { Component, OnInit, ViewEncapsulation, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LineChartComponent implements OnInit {
  d3:any = d3;
  @Input('lineChartData') dataset: Array<{}>;
  @Input() lineColor: string;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() selectorDiv: string;
  @Input() chartTitle: string;

  constructor() { }

  ngOnInit() {}
  
  ngOnChanges(changes: SimpleChanges){
    this.createLineChart();
  }

  createLineChart(){

    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
      width = document.getElementById(this.selectorDiv).clientWidth - margin.left - margin.right - 10,
      height = document.getElementById(this.selectorDiv).clientHeight - margin.top - margin.bottom - 10;

    var n = this.dataset.length;

    var xScale = this.d3.scaleLinear()
      .domain([0, n - 1])
      .range([0, width]); 
      
    var yScale = this.d3.scaleLinear()
      .domain([0, 1]) 
      .range([height, 0]); 

    var line = this.d3.line()
      .x(function (d, i) { return xScale(i); })
      .y(function (d:any) { return yScale(d.y); })
      .curve(this.d3.curveMonotoneX)

    var dataset = this.dataset;

    var svg = this.d3.select("#lineChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(this.d3.axisBottom(xScale))
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
      .datum(dataset)
      .attr("class", "line")
      .attr("d", line)
      .style("stroke", this.lineColor)
      .transition()
      .duration(750)
      .delay(function (d, i) {
        return i * 150;
      });

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text(this.chartTitle);
      
    svg.selectAll(".dot")
      .data(dataset)
      .enter().append("circle")
      .attr("class", "dot") 
      .attr("cx", function (d, i) { return xScale(i) })
      .attr("cy", function (d:any) { return yScale(d.y) })
      .attr("r", 5)
      .style("fill", this.lineColor)
      .on("mouseover", function (a) {
        console.log(a)
      })
      .on("mouseout", function () { })
  }

}
