import { Component, OnInit } from '@angular/core';
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
    type: '',
    xAxis : '',
    yAxis : ''
  }
  constructor(public dialogRef: MatDialogRef<ChartsComponent>,
              public reportViewService : ReportViewService) { }

  ngOnInit(){
    this.chartTypes = chart_types;
    this.selectedParams.type = this.chartTypes[0].value;
  }

  btnToggled(event){
    // this.selectedTab = event.value;
    console.log(event);
    let selected = event.value;
    this.chartTypes.forEach(ele=>ele.isSelected = event.value === ele.value?true:false)
    this.selectedParams.type = event.value;
    console.log(this.chartTypes);
    
    
  }

  insertSheet(){
    this.closeDailog();
    this.reportViewService.addNewSheet('','chart_data',this.selectedParams);
  }

  closeDailog():void{
    this.dialogRef.close();
  }

  checkPie(){
    return this.chartTypes.some(ele=>ele.value === 'pie' && ele.isSelected ? true:false)
  }

}
