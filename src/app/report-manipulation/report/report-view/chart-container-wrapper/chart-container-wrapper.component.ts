import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-container-wrapper',
  templateUrl: './chart-container-wrapper.component.html',
  styleUrls: ['./chart-container-wrapper.component.css']
})
export class ChartContainerWrapperComponent implements OnInit {
  @Input() data:any;
  constructor() { }

  ngOnInit() {
      console.log(this.data);
      console.log(this.lineChartData)    
    }

  lineChartData = d3.range(10).map(function (d) { return { "y": d3.randomUniform(1)() } });
  
  barChartData = [{ year: "2014", value: .07 },
  { year: "2015", value: .13 },
  { year: "2016", value: 156 },
  { year: "2017", value: .95 },
  { year: "2018", value: .81 },
  { year: "2019", value: .13 },
  { year: "2020", value: .13 },
  { year: "2021", value: .56 },
  { year: "2022", value: .95 },
  { year: "2023", value: .81 },
  { year: "2024", value: .13 }];

  pieChartData = [
    { "region": "North", "count": "53245"},
    { "region": "South", "count": "28479"},
    { "region": "East", "count": "19697"},
    { "region": "West", "count": "24037"},
    { "region": "Central", "count": "40245"}
  ]
  scatterPlotData = [
    {var1: 10, var2: 0},
    {var1: 20, var2: 10},
    {var1: 30, var2: 20},
    {var1: 40, var2: 30},
    {var1: 50, var2: 40},
    {var1: 60, var2: 50}
  ];

}
