import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-rename-sheet',
  templateUrl: './rename-sheet.component.html',
  styleUrls: ['./rename-sheet.component.css']
})
export class RenameSheetComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RenameSheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportViewService: ReportViewService) { }
  
  currentSheetName = "";
  sheetName = "";
  sheetNameExists: boolean = false;

  ngOnInit() {
    this.sheetName = this.data;
    this.currentSheetName = this.data;
  }

  renameSheet() {
    // if (!this.reportViewService.checkSheetNameInReport(this.sheetName.trim())){
      this.sheetNameExists = false;
      this.reportViewService.loaderSubject.next(true);
      this.closeDailog();
      this.reportViewService.renameSheetFromReport(this.data, this.sheetName.trim()).subscribe(res => {
      })
    // }
    // else {
    //   this.sheetNameExists = true
    // }
  }

  validateSheetName(){
    
    if(this.currentSheetName === this.sheetName)
      return false
    else if(this.sheetName.trim())
      return this.reportViewService.checkSheetNameInReport(this.sheetName.trim())
    else
      return false
    }

    isEmpty(){
      return this.sheetName.trim()?false:true;
    }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
