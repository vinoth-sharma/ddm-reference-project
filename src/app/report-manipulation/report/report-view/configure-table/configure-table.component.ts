import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ReportViewService } from "../report-view.service";
import { FormControl } from '@angular/forms';

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
    { value: "Georgia,serif", name: "" },
    { value: "'Times New Roman',Times,serif", name: '' },
    { value: "'Arial Black',Gadget,sans-serif", name: '' },
    { value: "'Comic Sans MS,cursive,sans-serif", name: '' },
    { value: "'Courier New',Courier,monospace", name: '' }
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
    headerBgColor: 'white',
    headerColor: 'black',
    fontFamily: ''
  }
  loaderEnable:boolean = false;

  ngOnInit() {
    console.log(this.data);
    this.injectedData.sheetData = this.data;
    this.getTableData();
  }

  getTableData() {
    this.loaderEnable = true;
    this.reportViewService.getReportDataFromHttp('', 'asc', 0, 5, this.injectedData.sheetData, 0).subscribe(res => {
      // console.log(res);
      this.injectedData.tableData = res;
      this.displayedColumns = res.data.sql_columns;

      this.columnDetails = this.injectedData.tableData.data.sql_columns.map(col => {
        return { original_column_name: col, view_column_name: col ,isEditable : false }
      })
      this.masterColumnDetails = JSON.parse(JSON.stringify(this.columnDetails))
      this.toppings.setValue(res.data.sql_columns)
      console.log(this.injectedData);
      console.log(this.columnDetails);
      this.loaderEnable = false;


    })
  }

  columnSelected(event){
    // console.log(event);
    this.columnDetails = this.masterColumnDetails.filter(column=>{
      if(event.value.some(col=>col=== column.original_column_name))
        return true
      else
        return false
      // column.original_column_name 
    })
    console.log(this.columnDetails);
    
  }


  columnDoubleClicked(event){
    console.log(event);
    this.columnDetails.forEach(element => {
      if(element.original_column_name === event)
          element.isEditable = true;
    });
  }
  valueEntered(event){
    console.log(event);
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
    this.reportViewService.updateTablePageJson(this.selectedParams,this.injectedData.sheetData)
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
