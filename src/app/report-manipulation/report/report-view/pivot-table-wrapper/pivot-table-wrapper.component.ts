import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-pivot-table-wrapper',
  templateUrl: './pivot-table-wrapper.component.html',
  styleUrls: ['./pivot-table-wrapper.component.css']
})
export class PivotTableWrapperComponent implements OnInit {
  @Input() tabData: any;
  @Input() sheetData: any;
  
  constructor(private reportViewService: ReportViewService) { }
  table = {
    rows : [],
    columnNames : []
  }
  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.tabData);
    console.log(this.sheetData);
    this.createPivotTable();  
  }
  
  createPivotTable(){
    this.reportViewService.getPivotTableData(this.tabData,this.sheetData).subscribe((res:any)=>{
      console.log(res);
      this.table.rows = res.data.data;
    })
  }

}
