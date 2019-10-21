import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ReportViewService } from '../report-view.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
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

  filteredColumnNames:Observable<any[]> ;
  filteredColumnNames1:Observable<any[]> ;
  myControl = new FormControl()
  myControl1 = new FormControl()

  constructor(public reportViewService: ReportViewService) { }

  ngOnInit() {}
  
    ngOnChanges(changes: SimpleChanges) {
    // console.log(this.tabData);
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
      this.filteredColumnNames = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value=>this._filter(value))
      )
      this.filteredColumnNames1 = this.myControl1.valueChanges
      .pipe(
        startWith(''),
        map(value=>this._filter(value))
      )

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

  private _filter(value){
    // console.log(value);
    const filterValue = value.toLowerCase();
    return this.columnDetails.filter(opt=>opt.columnName.toLowerCase().indexOf(filterValue) === 0)
  }

}
