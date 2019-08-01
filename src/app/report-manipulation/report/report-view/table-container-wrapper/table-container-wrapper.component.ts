import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialog , MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ReportViewService } from "../report-view.service";
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
  public selectedTabType = '';
  public filteredChartData ;

  public showTabRenameOpt: boolean = false;  //show options on right click on sheets(has rename and delete option)
  public selectedTabName:string = '';

  constructor(public dialog :MatDialog,
      public reportServices: ReportViewService) { }

  ngOnInit() {
    console.log(this.sheetData);

    this.iconList = iconList;
    this.selectedTabType = this.sheetData.tabs[0].tab_sub_type;
  }

  ngOnChanges(){
    console.log(this.sheetData);
  }

  getTabIcon(type){
    return iconList[type]
  }

  btnToggled(event){
    // console.log(this.sheetData);
    
    // this.selectedTabType = event.value;
    // console.log(event);
    this.sheetData.tabs.forEach(ele=>ele.isSelected = event.value === ele.uniqueId?true:false)
    
    this.selectedTabType = (this.sheetData.tabs.filter(ele=>ele.isSelected?ele:''))[0].tab_sub_type;
    console.log(this.selectedTabType);
    
    if(this.selectedTabType != 'table')
      this.filteredChartData = this.filterTabData()
  }

  filterTabData(){
    let filteredObj;
    this.sheetData.tabs.forEach(ele=>{
        ele.tab_sub_type === this.selectedTabType?filteredObj = ele:'';
    })
    return filteredObj
  }

  removeTabInSheet(){
    // console.log(data);
    this.reportServices.deleteTabInTableSheet(this.selectedTabName,this.sheetData.name);
    // this.selectedTabType = this.sheetData.tabs[this.sheetData.tabs.length-1].type;
    if(this.selectedTabType != 'table')
      this.filteredChartData = this.filterTabData()
  }

  tabClicked(event,tab) {
    console.log('right click done');

    console.log(event);
    console.log(tab);
    this.showTabRenameOpt = true;
    setTimeout(() => {
      let ele = document.getElementById('tabClickedOpts')
      console.log(ele);
      this.selectedTabName = tab.uniqueId;
      ele.style.left = (event.x - 10) + 'px';
      let topVal = event.y + 'px';
      let eleHeight = ele.clientHeight + 'px';
      ele.style.top = `25px`;
      ele.style.zIndex = `100`;
      // ele.style.top = `calc(${topVal} - ${eleHeight})`;
    }, 0);

    return false
  }

  @HostListener('document:click')
  clicked(){
    if(this.showTabRenameOpt)
      this.showTabRenameOpt = false;    
  }
}
