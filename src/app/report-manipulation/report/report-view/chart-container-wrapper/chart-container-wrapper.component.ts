import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-chart-container-wrapper',
  templateUrl: './chart-container-wrapper.component.html',
  styleUrls: ['./chart-container-wrapper.component.css']
})
export class ChartContainerWrapperComponent implements OnInit {
  @Input() tabData: any;
  @Input() sheetData: any;
  @Input() previewType: string;
  @Output() loadingFlag = new EventEmitter();

  constructor(public reportViewService: ReportViewService) { }

  tableData: any = [];
  graphData = [];
  tempFlagChartType = ''
  className_bar = "";

  ngOnInit() {
    // console.log(this.tabData);
    // console.log(this.sheetData)
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    // console.log(this.previewType);
    
    if(this.previewType === 'previewOnly'){
      this.loadingFlag.emit(true)
      this.className_bar = "previewBarChart"
    }
    else{
      this.reportViewService.loaderSubject.next(true);
      this.className_bar = "barChart"
    }
    
      this.tempFlagChartType = '';
    this.reportViewService.getReportDataFromHttp('', 'asc', 0, 10, this.sheetData, 10).subscribe(res => {
      // console.log(res);
      this.tableData = res;
      this.createGraphData();
      this.tempFlagChartType = this.tabData.tab_sub_type;
      this.reportViewService.loaderSubject.next(false);
      if(this.previewType === 'previewOnly')
        this.loadingFlag.emit(false)

      // console.log(this.graphData);
    });
  }

  createGraphData() {
    this.graphData = this.tableData.data.list.map(row => {
      let x = this.tabData.data.xAxis;
      let y = this.tabData.data.yAxis;
      return {
        [x]: isNaN(+row[x]) ? row[x] : +row[x],
        [y]: isNaN(+row[y]) ? row[y] : +row[y]
      }
    })
  }
}
