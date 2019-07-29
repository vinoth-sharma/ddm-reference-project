import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ReportViewService } from "../report-view.service";
import { GlobalReportServices } from '../global.reports.service';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.css']
})
export class DownloadReportComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DownloadReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportService: ReportViewService) { }

  sheetData: any = [];
  selectedSheets = [];
  ngOnInit() {
    console.log(this.data);
    this.sheetData = this.reportService.getSheetsFromReport();
    console.log(this.sheetData);

  }

  sheetSelected(event){
    console.log(event);
    this.selectedSheets = event.value;
    this.reportService.downloadReportFile(this.selectedSheets)
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
