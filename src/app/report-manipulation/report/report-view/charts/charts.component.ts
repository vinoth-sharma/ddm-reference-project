import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog , MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ReportViewService } from "../report-view.service";

const chart_types = [{
  name : 'Bar Chart',
  icon_name : 'insert_chart',
  value : 'bar',
  isSelected : false
},
{
  name : 'Line Chart' ,
  icon_name : 'show_chart',
  value : 'line',
  isSelected : false
},{
  name : 'Pie Chart',
  icon_name : 'pie_chart',
  value : 'pie',
  isSelected : false
},{
  name : 'Scattered Chart',
  icon_name : 'bubble_chart',
  value : 'scatter',
  isSelected : false
}]

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  chartTypes = [];
  selectedChartType = '';
  selectedParams = {
    name:'Chart',
    type: '',
    uniqueId: 'Chart ',
    data: {
      xAxis : '',
      yAxis : ''
    },
    isSelected : false
  }
  constructor(public dialogRef: MatDialogRef<ChartsComponent>,
              @Inject(MAT_DIALOG_DATA) public data:any,
              public reportViewService : ReportViewService) { }

  ngOnInit(){
    console.log('jj');
    console.log(this.data);
    console.log(this.chartTypes);
    chart_types.forEach(ele=>ele.isSelected = false)
    this.chartTypes = chart_types;

    // initial assignment 
      this.chartTypes[0].isSelected = true;
      this.selectedParams.type = this.chartTypes[0].value;      
      console.log(this.chartTypes);

  }

  btnToggled(event){
    // this.selectedTab = event.value;
    console.log(event);
    let selected = event.value;
    this.chartTypes.forEach(ele=>ele.isSelected = event.value === ele.value?true:false)
    this.selectedParams.type = event.value;
    
    
  }

  insertTabInSheet(){
    this.closeDailog();
    console.log(this.data.tabs.length);
    this.selectedParams.uniqueId = this.selectedParams.uniqueId + (this.data.tabs.length);
    this.reportViewService.addNewTabInTable(this.selectedParams,this.data.name);
  }

  closeDailog():void{
    this.dialogRef.close();
  }

  checkPie(){
    return this.chartTypes.some(ele=>ele.value === 'pie' && ele.isSelected ? true:false)
  }

}
