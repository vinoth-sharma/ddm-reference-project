import { Component, OnInit, Input } from '@angular/core';
import { ChartsComponent } from "../charts/charts.component";
import { PivotsComponent } from "../pivots/pivots.component";
import { CloneWorksheetComponent } from "../clone-worksheet/clone-worksheet.component";
import { MatDialog , MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { UploadFileComponent } from "../upload-file/upload-file.component";
import { DownloadReportComponent } from "../download-report/download-report.component";
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.css']
})
export class TableMenuComponent implements OnInit {
  @Input() sheetData:any;

  constructor(public dialog :MatDialog,public reportViewService: ReportViewService) { }


  ngOnInit() {
  }

  saveChartPivots(){
    this.reportViewService.savePageJson(this.sheetData).subscribe(res=>{
      console.log(res);
      
    })
  }

  openChartDialog(){
    const dialogRef = this.dialog.open(ChartsComponent,{
      data : { sheetData : this.sheetData }
    })
  }
  
  openPivotDialog(){
    const dialogRef = this.dialog.open(PivotsComponent,{
      data : this.sheetData
    })
  }

  openCloneSheets(){
    const dialogRef = this.dialog.open(CloneWorksheetComponent,{
      data : this.sheetData
    })
  }

  openImportDataDialog(){
    const dialogRef = this.dialog.open(UploadFileComponent,{
      data : this.sheetData
    })
  }

  openDownloadDialog(){
    const dialogRef = this.dialog.open(DownloadReportComponent,{
      data : this.sheetData
    })
    // dialogRef.afterClosed().subscribe(result=>{
    //   this.dialogClosed();
    //   console.log(result);
    // })
  }

}
