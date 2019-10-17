import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ReportViewService } from "../report-view.service";
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

const chart_types = [{
  name: 'Bar Chart',
  icon_name: 'insert_chart',
  value: 'bar',
  isSelected: false
},
{
  name: 'Line Chart',
  icon_name: 'show_chart',
  value: 'line',
  isSelected: false
}, {
  name: 'Pie Chart',
  icon_name: 'pie_chart',
  value: 'pie',
  isSelected: false
}, {
  name: 'Scattered Chart',
  icon_name: 'bubble_chart',
  value: 'scatter',
  isSelected: false
}]

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  chartTypes = [];
  selectedChartType = '';
  selectedParams = {
    tab_name: '',
    tab_type: 'chart',
    tab_sub_type: '',
    uniqueId: null,
    tab_title: '',
    data: {
      xAxis: '',
      yAxis: '',
      ticks: 10
    },
    isSelected: false
  }
  
  previewChartEnable:boolean = false;

  constructor(public dialogRef: MatDialogRef<ChartsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportViewService: ReportViewService) { }

  injectedData: any = {
    tableData: '',
    sheetData: ''
  }
  columnDetails = [];
  sheetNameExists: boolean = false;
  filteredColumnNames:Observable<any[]> ;
  filteredColumnNames1:Observable<any[]> ;
  myControl = new FormControl()
  myControl1 = new FormControl()

  ngOnInit() {
    // console.log(this.data);
    this.injectedData.sheetData = this.data.sheetData;

    chart_types.forEach(ele => ele.isSelected = false)
    this.chartTypes = chart_types;

    // initial assignment 
    this.chartTypes[0].isSelected = true;
    this.selectedParams.tab_sub_type = this.chartTypes[0].value;
    // console.log(this.chartTypes);

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

  xAxisSelected(event) {
    // this.selectedParams.data.xAxis = event.value;
    this.createChartName();
  }

  yAxisSelected(event) {
    // this.selectedParams.data.yAxis = event.value;
    this.createChartName();
  }

  enableEditNames:boolean = false;
  createChartName() {
    this.selectedParams.tab_name = this.selectedParams.data.xAxis + ' ' + 'vs' + ' ' + this.selectedParams.data.yAxis
    this.selectedParams.tab_title = this.selectedParams.data.xAxis + ' ' + 'vs' + ' ' + this.selectedParams.data.yAxis
    if(this.selectedParams.data.xAxis && this.selectedParams.data.yAxis)
      this.enableEditNames = true;
  }

  btnToggled(event) {
    // this.selectedTab = event.value;
    // console.log(event);
    let selected = event.value;
    this.chartTypes.forEach(ele => ele.isSelected = event.value === ele.value ? true : false)
    // this.selectedParams.tab_type = event.value;
    this.selectedParams.tab_sub_type = event.value;
  }

  insertTabInSheet() {
    if (!this.checkSheetNameExists()) {
      this.sheetNameExists = false;
      this.selectedParams.uniqueId = +new Date();
      this.selectedParams.tab_name = this.selectedParams.tab_name.trim();
      this.reportViewService.addNewTabInTable(this.selectedParams, this.injectedData.sheetData.sheetName);
      this.closeDailog();
    }
    else {
      this.sheetNameExists = true;
    }
  }

  // generateChartJson(){

  //   this.selectedParams.data.json = this.injectedData.tableData.data.list.map(row=>{
  //     let x = this.selectedParams.data.xAxis;
  //     let y = this.selectedParams.data.yAxis;
  //     return {
  //       [x] : isNaN(+row[x])?row[x]:+row[x],
  //       [y] : isNaN(+row[y])?row[y]:+row[y]
  //     }
  //   })
  // }
  checkSheetNameExists() {
    return this.reportViewService.checkSheetNameInReport(this.selectedParams.tab_name.trim())
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

  checkPie() {
    return this.chartTypes.some(ele => ele.value === 'pie' && ele.isSelected ? true : false)
  }

  previewChart(){
    this.previewChartEnable = true;
  }
  showLoader:boolean = false;

  loadingStatus(event){
    this.showLoader = event;

  }

  private _filter(value){
    // console.log(value);
    const filterValue = value.toLowerCase();
    return this.columnDetails.filter(opt=>opt.columnName.toLowerCase().indexOf(filterValue) === 0)
  }
}
