import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ReportViewService } from "../report-view.service";

@Component({
  selector: 'app-table-parameters',
  templateUrl: './table-parameters.component.html',
  styleUrls: ['./table-parameters.component.css']
})
export class TableParametersComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TableParametersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportService: ReportViewService) { }

  tableData: any = [];
  columnDetails: any = [];

  tableSheetData: any = {
    tableData: [],
    columnDetails: []
  }

  dataInject: boolean = false;

  ngOnInit() {
    // console.log(this.data);
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

  closeDailog(): void {
    this.dialogRef.close();
  }
}
