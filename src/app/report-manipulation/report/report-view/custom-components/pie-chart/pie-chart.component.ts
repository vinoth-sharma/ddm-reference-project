import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  d3: any = d3;
  @Input('pieChartData') data: Array<{}>
  @Input() selectorDiv: string;
  @Input() chartTitle: string;
  @Input() xAxisColumn: string;
  @Input() yAxisColumn: string;

  constructor() { 
  }

  ngOnInit() {
    // console.log(this.selectorDiv);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.createPieChart();
    // this.data = this.data.filter(item => item['VEH_EVNT_CD'] != 0)
  }

  createPieChart() {
    const width = document.getElementById(this.selectorDiv).clientWidth * 0.75 ;
    const height = document.getElementById(this.selectorDiv).clientHeight * 0.75;
    const radius = Math.min(width, height) / 2.1;

    const svg = this.d3.select("#" + this.selectorDiv)
      .append("svg")
      .attr("width", width * 1.2)
      .attr("height", height * 1.4)
      .append("g")
      .attr("transform", `translate(${width / 1.5}, ${height / 1.5})`);

    const color = this.d3.scaleOrdinal(this.d3.quantize(this.d3.interpolateRainbow, this.data.length + 1));

    const pie = this.d3.pie()
      .value((d: any) => d[this.yAxisColumn])
      .sort(null);

    const arc: any = this.d3.arc()
      .innerRadius(radius - 70)
      .outerRadius(radius);

    function arcTween(a) {
      const i = this.d3.interpolate(this._current, a);
      this._current = i(1);
      return (t) => arc(i(t));
    }

    const data: any = this.data;

    const path = svg.selectAll("path")
      .data(pie(data));

    path.transition().duration(200).attrTween("d", arcTween);
    let r = Math.min(width,height)/2
    path.enter().append('g').append("path")
      .attr("fill", (d, i: any) => color(i))
      .attr("d", arc)
      .attr("stroke", "white")
      .attr("stroke-width", "6px")
      .each(function (d: any) { this._current = d; })

    // path.enter().selectAll('g').data(data).enter().append('text').text(function(d){
    //   console.log("dd",d);
    //   return d.data.VEH_EVNT_DESC
    // })
    svg.selectAll('g').append('text').attr("text-anchor","middle").attr("x",function(d){
      let a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
      d.cy = Math.cos(a) * (r-45)
      return d.x = Math.cos(a) * (r + 40)
    }).attr("y",function(d){
      let a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
      d.cy = Math.sin(a) * (r-45)
      return d.x = Math.sin(a) * (r + 40)
    }).text(function(d){
        return d.data.VEH_EVNT_DESC + ":" + d.data.VEH_EVNT_CD
      })
      

    svg.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("text-decoration", "underline")
      .text(this.chartTitle);
  }
}
