import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ReportViewService } from "../report-view.service";

@Component({
  selector: 'app-configure-table',
  templateUrl: './configure-table.component.html',
  styleUrls: ['./configure-table.component.css']
})
export class ConfigureTableComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfigureTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public reportViewService: ReportViewService) { }

    selectedParams = {
      color : 'blue'
    }
  ngOnInit() {
    console.log(this.data);
    
  }

  saveModification(){

  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
