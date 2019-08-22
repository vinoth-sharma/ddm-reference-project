import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ReportViewService } from "../report-view.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table-parameters',
  templateUrl: './table-parameters.component.html',
  styleUrls: ['./table-parameters.component.css']
})
export class TableParametersComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TableParametersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportService: ReportViewService,
    private toasterService: ToastrService) { }

  tableData: any = [];
  columnDetails: any = [];
  selected = new FormControl(0);

  tableSheetData: any = {
    tableData: [],
    columnDetails: []
  }

  dataInject: boolean = false;

  ngOnInit() {
    // console.log(this.data);
    this.updateExistingParamData();
  }

  updateExistingParamData(){
    this.reportService.getReportDataFromHttp('', 'asc', 0, 5, this.data, 0).subscribe(res => {
      // console.log(res);
      this.tableSheetData.tableData = res;
      //  console.log(this.tableData);
      if (this.tableData.column_properties) {
        this.tableSheetData.columnDetails = this.tableSheetData.tableData.column_properties.map(col => {
          return { columnName: col.mapped_column, dataType: col.column_data_type }
        })
      }
      else {
        this.tableSheetData.columnDetails = this.tableSheetData.tableData.data.sql_columns.map(col => {
          return { columnName: col, dataType: '' }
        })
      }
      //  console.log(this.tableSheetData);
      this.dataInject = true
    })
  }

  enableEditing:boolean = false;
  selectedEditParam = {};

  editSelectedParam(event){
    this.enableEditing = true;
    this.selectedEditParam = event;
    this.selected.setValue(2);
  }

  closeEditParameter(event){
    this.enableEditing = false;
    this.selectedEditParam = {};
    this.selected.setValue(1);
    if(event === 'updated'){
      this.dataInject = false;
      this.updateExistingParamData();
      this.toasterService.success('parameter updated successfully')
    }
  }

  parameterCreated(event){
      this.dataInject = false;
      this.updateExistingParamData();
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
