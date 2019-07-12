import { Component, OnInit } from '@angular/core';
import { MatDialog , MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ChartsComponent } from "../charts/charts.component";
import { PivotsComponent } from "../pivots/pivots.component";

@Component({
  selector: 'app-table-container-wrapper',
  templateUrl: './table-container-wrapper.component.html',
  styleUrls: ['./table-container-wrapper.component.css']
})
export class TableContainerWrapperComponent implements OnInit {

  public selectedTab = ''
  constructor(public dialog :MatDialog) { }

  ngOnInit() {
    this.selectedTab = 'table'
  }

  btnToggled(event){
    this.selectedTab = event.value;
    console.log(event);
    let selected = event.value;
    
  }

  openChartDialog(){
    const dialogRef = this.dialog.open(ChartsComponent,{
      data : 'dataaaa'
    })
    dialogRef.afterClosed().subscribe(result=>{
      this.dialogClosed();
      console.log(result)
    })
  }
  openPivotDialog(){
    const dialogRef = this.dialog.open(PivotsComponent,{
      data : 'dataaaa'
    })
    dialogRef.afterClosed().subscribe(result=>{
      this.dialogClosed();
      console.log(result)
    })
  }

  dialogClosed(){
    this.selectedTab = 'table'
  }
}
