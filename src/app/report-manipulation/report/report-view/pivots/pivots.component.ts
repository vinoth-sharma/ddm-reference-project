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


  constructor(public dialogRef: MatDialogRef<PivotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportViewService: ReportViewService) { }

  injectedData: any = {
    tableData: '',
    sheetData: ''
  }
  columnDetails = [];

  ngOnInit() {
    console.log(this.data);

    this.injectedData.sheetData = this.data.sheetData;


    this.reportViewService.getReportDataFromHttp('', 'asc', 0, 5, this.injectedData.sheetData, 0).subscribe(res => {
      console.log(res);
      this.injectedData.tableData = res;
      console.log(this.injectedData);
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

  closeDailog(): void {
    this.dialogRef.close();
  }
}
