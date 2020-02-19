import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportViewService } from "../report-view.service";
import { GlobalReportServices } from '../global.reports.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.css']
})
export class DownloadReportComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DownloadReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportService: ReportViewService) { }
  sheets = new FormControl()
  disableMultiSelect: boolean = false;
  enableSubmitBtn: boolean = false;
  sheetData: any = [];
  selectedSheets = [];
  selectedFormat = 'xlsx';

  ngOnInit() {
    // console.log(this.data);
    this.sheetData = this.reportService.getSheetsFromReport();
    // console.log(this.sheetData);
  }

  formValidate() {
    if (this.disableMultiSelect) {
      this.enableSubmitBtn = this.selectedFormat ? true : false;
    }
    else {
      this.enableSubmitBtn = this.selectedFormat && this.selectedSheets.length > 0 ? true : false;
    }
  }

  sheetSelected(event) {
    // console.log(event);
    this.selectedSheets = event.value;
    this.formValidate();
  }

  selectAllSheet(event) {
    // console.log(event);
    this.disableMultiSelect = event.checked;
    this.formValidate();
  }

  downloadReport(){
    this.reportService.loaderSubject.next(true);
    let sheets = this.disableMultiSelect ? [] : this.selectedSheets;
    this.closeDailog();
    this.reportService.downloadReportFile(sheets, this.selectedFormat).subscribe((res: any) => {
      console.log(res);
      const url = window.URL.createObjectURL(res.data)
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', res.fileName)
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
