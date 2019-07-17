import { Component, OnInit, Input } from '@angular/core';
import { ChartsComponent } from "../charts/charts.component";
import { PivotsComponent } from "../pivots/pivots.component";
import { MatDialog , MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.css']
})
export class TableMenuComponent implements OnInit {
  @Input() sheetData:any;
  constructor(public dialog :MatDialog) { }


  ngOnInit() {
  }

  openChartDialog(){
    const dialogRef = this.dialog.open(ChartsComponent,{
      data : this.sheetData
    })
    dialogRef.afterClosed().subscribe(result=>{
      // this.dialogClosed();
      console.log(result)
    })
  }
  openPivotDialog(){
    const dialogRef = this.dialog.open(PivotsComponent,{
      data : this.sheetData
    })
    dialogRef.afterClosed().subscribe(result=>{
      // this.dialogClosed();
      console.log(result)
    })
  }

  dialogClosed(){
    // this.selectedTab = 'table'
  }

}
