import { Component, OnInit, Inject, Input, Output, EventEmitter, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ChartConfiguration } from 'c3';

@Component({
  selector: 'app-chart-selector',
  templateUrl: './chart-selector.component.html',
  styleUrls: ['./chart-selector.component.scss']
})

export class ChartSelectorComponent implements OnInit {
  @Input() view;
  @Output() update = new EventEmitter();
  public chartTypes = [
    'line',
    'bar',
    'pie',
    'scatter',
    'stacked-bar'
  ];
  public selectedChartType = 'line';
  public xAxis = '';
  public yAxis = [''];
  public columns = [];
  private data;
  public chartData;
  public noOfTicks: number = 10;
  public minY: number;
  public maxY: number;

  @Input() chartInputData = this.chartData;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) data) {
    if (this.view !== 'sidenav') {
      this.view = 'dialog';
      this.data = data;
    } else {
      this.data = this.chartInputData.data.json;
    }
    if (this.data) {
      this.columns = this.getKeys(data[0]);
      this.xAxis = this.columns[0];
      this.yAxis = [this.columns[1]];
      this.chartData = this.updateChartData(this.selectedChartType);
    }
  }

  ngOnInit() {
    if (this.view === 'sidenav') {
      this.data = this.chartInputData.data.json;
      this.columns = this.getKeys(this.data[0]);
      this.xAxis = this.chartInputData.data.keys.x;
      this.yAxis = this.chartInputData.data.keys.value;
      this.selectedChartType = this.chartInputData.data.type;
      this.chartData = this.updateChartData(this.selectedChartType);
    }
  }

  getKeys(obj) {
    return Object.keys(obj);
  }

  updateChartData(chartType: string) {
    const updatedChartData: ChartConfiguration = {
      data: {
        json: this.data,
        keys: {
          x: this.xAxis,
          value: this.yAxis
        },
        type: chartType,
        colors: this.getDataColors(),
        groups: []
      },
      legend: {
        position: 'right'
      },
      axis: {
        x: {
          type: 'category',
          label: {
            text: this.xAxis,
            position: 'outer-center'
          },
          tick: {
            rotate: -90,
            multiline: false,
            culling: 100
          },
          height: 130
        },
        y: {
          label: {
            text: this.yAxis,
            position: 'outer-middle'
          },
          padding: {
            bottom: 0
          },
          min: this.setRanges('min', this.yAxis),
          max: this.setRanges('max', this.yAxis),          
          tick: {
            values: this.getTickValues(this.minY, this.maxY, this.noOfTicks)
          }
        }
      },
      // grid: {
      //   x: {
      //     show: true
      //   },
      //   y: {
      //     show: true
      //   }
      // }
    };

    updatedChartData.isStacked = false;
    if (this.selectedChartType === 'stacked-bar') {
      updatedChartData.data.type = 'bar';
      updatedChartData.isStacked = true;
      updatedChartData.data.groups = [this.yAxis];
    }

    this.chartData = updatedChartData;
    this.update.emit(updatedChartData);
    return updatedChartData;
  }

  setRanges(type: string, axis: string[]) {
    let values = this.getArrayOfValues(axis);
    this.minY = this.getRanges('min', values);
    this.maxY = this.getRanges('max', values);

    if (this.minY === this.maxY) {
      return type === 'min' ? Math.round(this.minY - 10) : Math.round(this.maxY + 10);
    }

    return type === 'min' ? Math.round(this.minY) : Math.round(this.maxY);
  }

  getTickValues(min: number, max: number, noOfTicks: number) {
    return Array(noOfTicks).fill(min).map((value, index) => Math.round(value + index * (max - min) / (noOfTicks - 1)));
  }

  getArrayOfValues(columns: string[]) {
    let values = [0];

    columns.forEach(col => {
      let colValues = this.data.map(d => d[col]).filter(v => typeof v === 'number');
      values.push(...colValues)
    });
    
    return values;
  }

  getRanges(type: string = 'max', values: number[]) {
    return type === 'min' ? Math.min(...values) : Math.max(...values);
  }

  getColorsArray() {
    let colorString = '1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf';
    let n = colorString.length / 6 | 0
    let colors = new Array(n);
    let i = 0;

    while (i < n) {
      colors[i] = "#" + colorString.slice(i * 6, ++i * 6)
    };

    // array of 10 colors
    return colors;
  }

  getDataColors() {
    let colorsArray = this.getColorsArray();
    let colors = {};
    this.yAxis.forEach((item, index) => {
      let colorIndex = index % colorsArray.length;
      colors[item] = colorsArray[colorIndex];
    });

    return colors;
  }

}