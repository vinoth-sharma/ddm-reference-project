import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog , MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-rename-sheet',
  templateUrl: './rename-sheet.component.html',
  styleUrls: ['./rename-sheet.component.css']
})
export class RenameSheetComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RenameSheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public reportViewService : ReportViewService) { }

  sheetName= '';
    
  ngOnInit() {
    this.sheetName = this.data;
  }

  renameSheet(){
    this.reportViewService.renameSheetFromReport(this.data,this.sheetName).subscribe(res=>{
      this.closeDailog()
    })
  }

  closeDailog():void{
    this.dialogRef.close();
  }
}
