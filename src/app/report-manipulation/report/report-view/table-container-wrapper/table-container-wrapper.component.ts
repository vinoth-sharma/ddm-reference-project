import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialog , MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ReportViewService } from "../report-view.service";
import { ConfirmationDialogComponent } from "../custom-components/confirmation-dialog/confirmation-dialog.component";
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
  public selectedTabSubType = '';
  public filteredChartData ;

  public showTabRenameOpt: boolean = false;  //show options on right click on sheets(has rename and delete option)
  public selectedTabUniqueId = '';

  public refreshTableData:boolean = true;
  public showLeftRightIcon:boolean = false;
  constructor(private reportServices: ReportViewService , 
    public dialog :MatDialog) { }


  ngOnInit() {
    console.log(this.sheetData);

    this.iconList = iconList;
    this.sheetData.tabs.forEach((ele,index)=>{
      ele.isSelected = index===0?true:false;
    })  
    this.selectedTabSubType = this.sheetData.tabs[0].tab_sub_type;
    this.checkTabWidth();

    this.reportServices.refreshTableDataAppliedParam.subscribe(res=>{
      console.log('in');
      //refresh the tables
      this.refreshTableData = false;
      this.checkTabWidth();
      setTimeout(() => {
        this.refreshTableData = true;
      }, 0);
    })
  }

  ngOnChanges(){
    console.log(this.sheetData);
  }

  getTabIcon(type){
    return iconList[type]
  }

  btnToggled(event){
    console.log(this.sheetData);
    // console.log(event);
    this.sheetData.tabs.forEach(ele=>{
        ele.isSelected = event.value === ele.uniqueId?true:false
      })  
    
    this.selectedTabSubType = (this.sheetData.tabs.filter(ele=>ele.isSelected?ele:''))[0].tab_sub_type;
    console.log(this.selectedTabSubType);
    
    if(this.checkChart(this.selectedTabSubType))
      this.filteredChartData = this.filterTabData(event)
  }
  
  checkChart(chart){
    let charts_type = ['bar','pie','scatter','line']
    return charts_type.some(ele=>ele===chart)
  }

  filterTabData(event){
    let filteredObj;

    this.sheetData.tabs.forEach(ele=>{
      event.value === ele.uniqueId?filteredObj = ele:'';
    })
    return filteredObj
  }


  openDeleteSheetTabDailog(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data : {  confirmation:false ,
        modalTitle : 'Delete Tab',
        modalBody : 'This operation delete tab from particular sheet in report UI level.To delete permanently please do save chart option ',
        modalBtn : 'Delete' }
    })
    dialogRef.afterClosed().subscribe(result=>{
      // this.dialogClosed();
      console.log(result);
      if(result)
        result.confirmation? this.removeTabInSheet():'';
    })
  }

  removeTabInSheet(){
    // console.log(data);
    this.reportServices.deleteTabInTableSheet(this.selectedTabUniqueId,this.sheetData.name);
   
    //after deletion updated the last tab
    this.selectedTabSubType = this.sheetData.tabs[this.sheetData.tabs.length-1].tab_sub_type;
    this.selectedTabUniqueId = this.sheetData.tabs[this.sheetData.tabs.length-1].uniqueId;

    //made selected unique id as selected tab
    this.sheetData.tabs.forEach(ele=>{
      ele.isSelected = this.selectedTabUniqueId === ele.uniqueId?true:false
    })  
    
    if(this.checkChart(this.selectedTabSubType))
      this.filteredChartData = this.filterTabData({value: this.selectedTabUniqueId})

      //just refreshing the page
      this.refreshTableData = false;
      this.checkTabWidth();
      setTimeout(() => {
        this.refreshTableData = true;
      }, 0);
  }

  tabClicked(event,tab) {
    console.log('right click done');

    console.log(event);
    console.log(tab);
    this.showTabRenameOpt = true;
    setTimeout(() => {
      let ele = document.getElementById('tabClickedOpts')
      console.log(ele);
      this.selectedTabUniqueId = tab.uniqueId;
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

  checkTabWidth(){
    let tabWrapperWidth = (this.sheetData.tabs.length * 84) + 4;
    if(tabWrapperWidth >= 650){
      this.showLeftRightIcon = true;
    }
    else
      this.showLeftRightIcon = false
  }

  rightScroll(){
    let leftPos = $('.scroll-wrapper').scrollLeft();
    $('.scroll-wrapper').animate({  scrollLeft : leftPos + 150 }, 500)
  }


  leftScroll(){
    let leftPos = $('.scroll-wrapper').scrollLeft();
    $('.scroll-wrapper').animate({  scrollLeft : leftPos - 150 }, 500)
  }
}
