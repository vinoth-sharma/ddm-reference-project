import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3'

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  d3:any = d3;
  @Input('barChartData') dataset: Array<{}>;
  @Input() barColor: string;
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() xAxisColumn: string;
  @Input() yAxisColumn: string;
  @Input() selectorDiv: string;
  @Input() chartTitle: string;

  constructor() { }

  ngOnInit() {
  }
  
  ngOnChanges(changes: SimpleChanges){
    this.createBarChart()
    
  }

  createBarChart(){
    var margin = { top: 40, right: 30, bottom: 30, left: 20 },
      width = document.getElementById(this.selectorDiv).clientWidth - margin.left - margin.right - 10,
      height = document.getElementById(this.selectorDiv).clientHeight - margin.top - margin.bottom -10,
      padding = 80;

    var barColor = this.barColor;


    // var formatPercent = d3.format(".0%");

    var svg = d3.select("#barChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + 1.1* margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
      .range([padding, width - padding])
      .padding(0.4);
    var y = d3.scaleLinear()
      .range([height - padding, padding]);

    var xAxis = d3.axisBottom(x).tickSize([].length).tickPadding(10);
    var yAxis = d3.axisLeft(y)

    var dataset = this.dataset

    x.domain(dataset.map(d => {
      return d[this.xAxisColumn]
    }));

    const rangeArray = dataset.map(d => {
      return d[this.yAxisColumn]
    })
    y.domain([
       Math.min(...rangeArray), Math.max(...rangeArray)
    ]);
    let div = d3.select('body').append('div').attr('class','tooltip-chart').style('opacity',0).style("z-index",9999999)
    let l_attr = svg.append("g")
      .attr("class", "x axis")
      // .attr("transform", "translate(0," + height + ")")
      .attr("transform","translate(0,"+ ( height - padding ) + ")")
      .call(xAxis)

      l_attr.selectAll("text")
      .call(wrap,x.bandwidth())

      l_attr.selectAll('text').on("mouseover",function(d){
        div.transition().duration(200).style("opacity",0.9)
        div.html(`<span>${d}</span>`).style("left",(d3.event.pageX + 10) + 'px')
                    .style("top",(d3.event.pageY-20 )+ "px")
      })
      .on("mouseout",function(d){
        div.transition().duration(500).style("opacity",0)
      })

      l_attr.append("text")
      // .attr("x", (width))
      // .attr("y", "-10px")
      // .attr("dx", "1em")
      .style("text-anchor", "middle")
      // .attr("transform","translate("+ (padding/2) +","+(height/2)+")rotate(-90)")
      .attr("transform","translate(" + (width/2) +  "," + ( 100 - (padding/3))+")")
      .style("fill", "gray")
      .text(this.xAxisLabel);

      l_attr.selectAll("tspan").style("width","20px").style("overflow","hidden")
      // l_attr.selectAll("tspan").attr("textLength","40").attr("lengthAdjust","spacing")

  let y_attr =  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+padding+",0)")
      .call(yAxis).
      append("text")

      


      // .attr("transform","translate("+ (width/2) +  "," + ( height - (padding/3))+")")
      .attr("transform","translate("+  0 +","+10+")rotate(0)")
      // .attr("transform", "rotate(-180)")
      // .attr("y", 6)
      // .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .style("fill", "gray")
      .text(this.yAxisLabel);

      svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+padding+",0)")
      .call(yAxis).selectAll('text').on("mouseover",function(d){
        div.transition().duration(200).style("opacity",0.9)
        div.html(`<span>${d}</span>`).style("left",(d3.event.pageX + 10) + 'px')
        .style("top",(d3.event.pageY-20 )+ "px")
      })
      .on("mouseout",function(d){
        div.transition().duration(500).style("opacity",0)
      })

    svg.selectAll(".bar")
      .data(dataset)
      .enter().append("rect")
      .attr("class", "bar")
      .style("display", d => { return d[this.yAxisLabel] === null ? "none" : null; })
      .style("fill", barColor)
      .attr("x", d => { 
        return x(d[this.xAxisColumn]); })
      .attr("width", x.bandwidth())
      .attr("y", d => { return height})
      .attr("height", 0)
      .transition()
      .duration(750)
      .delay(function (d, i) {
        return i * 150;
      })
      .attr("y", d => { return y(d[this.yAxisColumn]); })
      .attr("height", d => { return height - y(d[this.yAxisColumn] ) - padding; });

    svg.selectAll(".label")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "label")
      .style("display", d => { return d[this.yAxisColumn] === null ? "none" : null; })
      .attr("x", (d => { return x(d[this.xAxisColumn]) + (x.bandwidth() / 2) - 8; }))
      .style("fill", barColor)
      .attr("y", d => { return height; })
      .attr("height", 0)
      .transition()
      .duration(750)
      .delay((d, i) => { return i * 150; })
      .text(d => { return d[this.yAxisColumn]; })
      .attr("y", d => { return y(d[this.yAxisColumn]) + .1; })
      .attr("dy", "-.7em");

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text(this.chartTitle);  }
}


function wrap(text, width) {
  text.each(function(dat) {
  var text = d3.select(this),
  words = text.text().split(/\s+/).reverse(),
  word,
  line = [],
  lineNumber = 0,
  lineHeight = 1.1, // ems
  y = text.attr("y"),
  dy = parseFloat(text.attr("dy")),
  tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
  if(dat.length > 10){
    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(dat.substring(0,7)+"...");
    return
  }else{
    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(dat);
  }
  // while (word = words.pop()) {
  // line.push(word);
  // tspan.text(line.join(" "));
  // if (tspan.node().getComputedTextLength() > width) {
  // line.pop();
  // tspan.text(line.join(" "));
  // line = [word];
  // tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
  // }
  // }
  });
 }