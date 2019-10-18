import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { OnInit, Component, Inject } from '@angular/core';
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-pivots',
  templateUrl: './pivots.component.html',
  styleUrls: ['./pivots.component.css']
})
export class PivotsComponent implements OnInit {
  function = ['sum', 'avg', 'min', 'max', 'count']

  constructor(public dialogRef: MatDialogRef<PivotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportViewService: ReportViewService) { }

  injectedData: any = {
    tableData: '',
    sheetData: ''
  }
  
  columnDetails = [];

  selectedRow = [];
  selectedValue = [];

  selected = {
    tab_name: '',
    tab_type: 'pivot',
    tab_sub_type: 'pivot',
    uniqueId: null,
    tab_title: '',
    data: {
      rowField: [],
      dataField: [],
      column:[]
    },
    isSelected: false,
  }

  sheetNameExists: boolean = false;
  enablePreview: boolean = false;
  isPivotVaid: boolean = false;

  ngOnInit() {
    // console.log(this.data);
    this.injectedData.sheetData = this.data.sheetData;
    this.selected.tab_name = this.data.sheetData.sheetName + '_pivot'
    this.selected.tab_title = this.data.sheetData.sheetName + '_pivot_title'

    this.reportViewService.getReportDataFromHttp('', 'asc', 0, 5, this.injectedData.sheetData, 0).subscribe(res => {
      // console.log(res);
      this.injectedData.tableData = res;
      // console.log(this.injectedData);
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

  rowFieldSelected(event) {
    this.selected.data.rowField = event.value;
  }

  dataFieldSelected(event) {

    let checkedDataField = event.value;

    checkedDataField.forEach(element => {
      if(this.selected.data.dataField.some(ele=>ele.value === element))
      { 
        return 0
      }
      else{
        this.selected.data.dataField.push({
          function: '',
          value: element
        })
      }
    });
    
    this.selected.data.dataField = this.selected.data.dataField.filter(ele=>{
      if(checkedDataField.some(obj=>obj === ele.value))
        return true
      else
        return false
    })

    // this.selected.data.dataField = [];
    // for (let index = 0; index < event.value.length; index++) {
    //   const element = event.value[index];
    //   this.selected.data.dataField.push({
    //     function: '',
    //     value: element
    //   })
    // }
  }

  formValid(){
    if(this.selected.data.rowField.length > 0 && this.selected.data.dataField.length > 0 && this.isPivotVaid){
      return this.selected.data.dataField.every(datafield=>{
        return datafield.function && datafield.value
      })     
    }
    else
     return false
  }
  
  formValidPreview(){
    if(this.selected.data.rowField.length > 0 && this.selected.data.dataField.length > 0){
      return this.selected.data.dataField.every(datafield=>{
        return datafield.function && datafield.value
      })     
    }
    else
     return false
  }

  checkSheetNameExists() {
    return this.reportViewService.checkSheetNameInReport(this.selected.tab_name.trim())
  }
  
  insertTabInSheet() {
    if (!this.checkSheetNameExists()) {
      this.sheetNameExists = false;
      this.selected.uniqueId = +new Date();
      this.selected.tab_name = this.selected.tab_name.trim();
      this.reportViewService.addNewTabInTable(this.selected, this.injectedData.sheetData.sheetName);
      this.closeDailog();
    }
    else {
      this.sheetNameExists = true;
    }
  }

  previewPivot(){
    if(this.enablePreview)
      this.isPivotVaid = false;
    
    this.enablePreview = this.enablePreview?false:true;
    
  }

  pivotResGenerated(event){
    // console.log(event);
    this.isPivotVaid = event;
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
