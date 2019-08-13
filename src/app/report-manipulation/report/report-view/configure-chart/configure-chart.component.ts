import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-configure-chart',
  templateUrl: './configure-chart.component.html',
  styleUrls: ['./configure-chart.component.css']
})
export class ConfigureChartComponent implements OnInit {
  @Input() sheetData:any;
  @Input() tabData:any;
  @Output() closeSideBar = new EventEmitter();

  injectedData: any = {
    tableData: '',
    sheetData: ''
  }
  columnDetails = [];
  
  selectedParams = {
   xAxis : '',
   yAxis : '',
   color : '',
   title : '',
   uniqueId :''
  }

  constructor(public reportViewService: ReportViewService) { }

  ngOnInit() {}
  
    ngOnChanges(changes: SimpleChanges) {
    console.log(this.tabData);
    // console.log(this.sheetData);
    
    this.injectedData.sheetData = this.sheetData;
    this.selectedParams.title = this.tabData.tab_title?this.tabData.tab_title:this.tabData.tab_name;
    this.selectedParams.uniqueId = this.tabData.uniqueId;
    this.selectedParams.xAxis = this.tabData.data.xAxis;
    this.selectedParams.yAxis = this.tabData.data.yAxis;
    this.selectedParams.color = this.tabData.data.color?this.tabData.data.color:'blue';
      
    this.reportViewService.getReportDataFromHttp('', 'asc', 0, 5, this.injectedData.sheetData, 0).subscribe(res => {
      // console.log(res);
      this.injectedData.tableData = res;

      if (this.injectedData.tableData.column_properties) {
        this.columnDetails = this.injectedData.tableData.column_properties.map(col => {
          return { columnName: col.mapped_column, dataType: col.column_data_type }
        })
      }
      else {
        this.columnDetails = this.injectedData.tableData.data.sql_columns.map(col => {
          return { columnName: col, dataType: '' }
        })
      }

    })  
  }

  saveConfig(){
    // console.log(this.selectedParams);
    this.reportViewService.updateChartPageJson(this.selectedParams,this.sheetData);
    this.closeSideBar.emit('close')    
  }

  cancelConfig(){
    this.closeSideBar.emit('close')    
  }

}
