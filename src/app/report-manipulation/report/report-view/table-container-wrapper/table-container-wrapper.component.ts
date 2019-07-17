import { Component, OnInit, Input } from '@angular/core';
import { MatDialog , MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ChartsComponent } from "../charts/charts.component";
import { PivotsComponent } from "../pivots/pivots.component";

const iconList = {
  table : 'grid_on',
  bar : 'insert_chart',
  line : 'show_chart',
  pie : 'pie_chart',
  scatter : 'bubble_chart'
}
@Component({
  selector: 'app-table-container-wrapper',
  templateUrl: './table-container-wrapper.component.html',
  styleUrls: ['./table-container-wrapper.component.css']
})
export class TableContainerWrapperComponent implements OnInit {
  @Input() sheetData:any;
  iconList;
  public selectedTab = ''
  constructor(public dialog :MatDialog) { }

  ngOnInit() {
    this.iconList = iconList;
    console.log(this.sheetData);
    console.log('k');
    
    // this.selectedTab = 'table'
  }

  getTabIcon(type){
    return iconList[type]
  }

  btnToggled(event){
    this.selectedTab = event.value;
    console.log(event);
    let selected = event.value;
    
  }

}
