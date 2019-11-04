import { Component, OnInit, Input } from '@angular/core';
import { ChartsComponent } from "../charts/charts.component";
import { PivotsComponent } from "../pivots/pivots.component";
import { CloneWorksheetComponent } from "../clone-worksheet/clone-worksheet.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { UploadFileComponent } from "../upload-file/upload-file.component";
import { DownloadReportComponent } from "../download-report/download-report.component";
import { CreateParametersComponent } from "../create-parameters/create-parameters.component";
import { TableParametersComponent } from "../table-parameters/table-parameters.component";
import { ReportViewService } from '../report-view.service';
import { ConfigureTableComponent } from '../configure-table/configure-table.component'
import { Router } from "@angular/router";
import { GlobalReportServices } from '../global.reports.service';

@Component({
  selector: 'app-table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.css']
})
export class TableMenuComponent implements OnInit {
  @Input() sheetData: any;
  @Input() tabType:String;

  reportName :string = '';
  noDataFound :boolean = false;

  constructor(public dialog: MatDialog, 
              public reportViewService: ReportViewService,
        public router : Router,
        public globalService : GlobalReportServices) { }

  ngOnInit() {

    
    this.reportName = this.reportViewService.getReportName()
    this.reportViewService.getTableDataDone.subscribe((res:any)=>{
      // console.log(res);
      if(res.length === 0)
        this.noDataFound = true
      else if(res.length === 1)
        this.noDataFound = this.checkObjVal(res) 
      else
        this.noDataFound = false;
    })
  }

  ngOnChanges(){
    // console.log(this.sheetData);
    // console.log(this.tabType);
  }

  checkObjVal(arr){
    return arr.every(a=>{
      for(let obj in a){
       return a[obj] === null || a[obj] === "" || a[obj] == undefined
      }
    })

  }
  
  saveChartPivots() {
    this.reportViewService.loaderSubject.next(true);

    this.reportViewService.savePageJson(this.sheetData).subscribe(res => {
      // console.log(res);
      this.reportViewService.loaderSubject.next(false);
    })
  }

  openChartDialog() {
    const dialogRef = this.dialog.open(ChartsComponent, {
      data: { sheetData: this.sheetData }
    })
  }

  openPivotDialog() {
    const dialogRef = this.dialog.open(PivotsComponent, {
      data: { sheetData: this.sheetData }
    })
  }

  openCloneSheets() {
    const dialogRef = this.dialog.open(CloneWorksheetComponent, {
      data: this.sheetData
    })
  }

  openImportDataDialog() {
    const dialogRef = this.dialog.open(UploadFileComponent, {
      data: this.sheetData
    })
  }

  openDownloadDialog() {
    const dialogRef = this.dialog.open(DownloadReportComponent, {
      data: this.sheetData
    })
    // dialogRef.afterClosed().subscribe(result=>{
    //   this.dialogClosed();
    //   console.log(result);
    // })
  }

  openCreateParametersDialog() {
    const dialogRef = this.dialog.open(TableParametersComponent, {
      data: this.sheetData
    })
  }

  openEditTableDialog(){
    const dialogRef = this.dialog.open(ConfigureTableComponent, {
      data: this.sheetData
    })
  }

  routeCreateReport(){
    let reportId = this.globalService.getSelectedIds().report_id
    this.router.navigate(['semantic/sem-reports/create-report'],{ queryParams: { report : reportId } });
    // this.router.navigate(['semantic/sem-reports/create-report'], {queryParams: {report: report.report_id,sheet: result.sheetId}});

  }
}

