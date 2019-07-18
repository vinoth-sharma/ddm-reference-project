import { Component, OnInit, Input, HostListener } from '@angular/core';
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
  public selectedTab = '';
  public filteredChartData ;

  public showTabRenameOpt: boolean = false;  //show options on right click on sheets(has rename and delete option)
  public selectedTabName:string = '';

  constructor(public dialog :MatDialog,
      public reportServices: ReportViewService) { }

  ngOnInit() {
    console.log(this.sheetData);

    this.iconList = iconList;
    this.selectedTab = this.sheetData.tabs[0].type;
  }

  ngOnChanges(){
    console.log(this.sheetData);
  }

  getTabIcon(type){
    return iconList[type]
  }

  btnToggled(event){
    this.selectedTab = event.value;
    // console.log(event);
    if(this.selectedTab != 'table')
      this.filteredChartData = this.filterTabData()
  }

  filterTabData(){
    let filteredObj;
    this.sheetData.tabs.forEach(ele=>{
        ele.type === this.selectedTab?filteredObj = ele:'';
    })
    return filteredObj
  }

  removeTabInSheet(){
    // console.log(data);
    this.reportServices.deleteTabInTableSheet(this.selectedTabName,this.sheetData.name);
    // this.selectedTab = this.sheetData.tabs[this.sheetData.tabs.length-1].type;
    if(this.selectedTab != 'table')
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
