import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ReportViewService } from "../report-view.service";
import { FormControl } from '@angular/forms';
import { constants_value } from 'src/environments/environment';

@Component({
  selector: 'app-configure-table',
  templateUrl: './configure-table.component.html',
  styleUrls: ['./configure-table.component.css']
})
export class ConfigureTableComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfigureTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportViewService: ReportViewService) { }
  
    fontFamily = [
    { value: "'Helvetica Neue',Helvetica,Arial,sans-serif" ,name:'' },
    { value: "Georgia,serif", name: "" },
    { value: "'Times New Roman',Times,serif", name: '' },
    { value: "'Arial Black',Gadget,sans-serif", name: '' },
    { value: "'Comic Sans MS,cursive,sans-serif", name: '' },
    { value: "'Courier New',Courier,monospace", name: '' }
  ]

  fontSize = [
    { value: "10px" ,name:'' },
    { value: "11px", name: "" },
    { value: "12px", name: '' },
    { value: "13px", name: '' },
    { value: "14px", name: '' },
    { value: "15px", name: '' }
  ]
  
  injectedData: any = {
    tableData: '',
    sheetData: ''
  }
  masterColumnDetails:any;
  toppings = new FormControl();
  columnDetails: any;
  displayedColumns:any;
  selectedParams = {
    headerBgColor: "white",
    headerColor: "black",
    fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
    fontSize: '14px'
  }
  loaderEnable:boolean = false;

  ngOnInit() {
    this.injectedData.sheetData = this.data;
    // console.log(this.data);
    this.getTableData();
  }

  setSelectedParams(res){
    let obj = this.data.tabs.filter(json=>json.tab_type === 'table')[0];
    // console.log(obj);
    
    if(obj.data.isCustomized){
      this.selectedParams.fontFamily = obj.data.fontFamily
      this.selectedParams.fontSize = obj.data.hasOwnProperty('fontSize') ? obj.data.fontSize : '14px'
      this.selectedParams.headerBgColor = obj.data.headerBgColor
      this.selectedParams.headerColor = obj.data.headerColor
      this.masterColumnDetails = obj.data.columnName_mapping
      this.columnDetails = obj.data.columnName_mapping.filter(row=>row.isColumnSelected)
      this.toppings.setValue(this.columnDetails.map(ele=>ele.original_column_name)  )
    }
    else
      this.toppings.setValue(res.data.sql_columns)
  }

  getTableData() {
    this.loaderEnable = true;
    this.reportViewService.getReportDataFromHttp('', 'asc', 0, 5, this.injectedData.sheetData, 0).subscribe(res => {
      // console.log(res);
      this.injectedData.tableData = res;
      this.displayedColumns = res.data.sql_columns;

      this.columnDetails = this.injectedData.tableData.data.sql_columns.map(col => {
        return { original_column_name: col, view_column_name: this.encryptedWordRemoval(col) ,isEditable : false , isColumnSelected : true}
      })
      this.masterColumnDetails = JSON.parse(JSON.stringify(this.columnDetails))
      
      
      this.setSelectedParams(res);
      this.loaderEnable = false;
    })
  }

  columnSelected(event){
    // console.log(event);
    //column filtered is stored in isColumnSelected flag
    this.masterColumnDetails.filter(column=>{
      if(event.value.some(col=>col=== column.original_column_name))
        column.isColumnSelected = true
      else
        column.isColumnSelected = false
    })

    //filtering the selected columns
    this.columnDetails = this.masterColumnDetails.filter(column=>{
      if(event.value.some(col=>col=== column.original_column_name))
        return true
      else
        return false
      // column.original_column_name 
    })
    // console.log(this.columnDetails);
  }


  columnDoubleClicked(event){
    this.columnDetails.forEach(element => {
      if(element.original_column_name === event)
          element.isEditable = true;
    });
  }
  valueEntered(event){
    this.columnDetails.forEach(element => {
      if(element.original_column_name === event)
          element.isEditable = false;
    });
  }

  columnNameInput(column_entered,original_column){
    // console.log(column_entered);
    this.masterColumnDetails.forEach(element => {
      if(element.original_column_name === original_column)
        element.view_column_name = column_entered
    });
  }

  saveModification(){
    this.reportViewService.updateTablePageJson(this.selectedParams,this.masterColumnDetails,this.injectedData.sheetData)
    this.closeDailog();
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

  encryptedWordRemoval(value){
    let reg = new RegExp(constants_value.encryption_key,"g")
    return value.replace(reg," ")
  }
}
