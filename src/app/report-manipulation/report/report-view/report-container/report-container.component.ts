import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-report-container',
  templateUrl: './report-container.component.html',
  styleUrls: ['./report-container.component.scss']
})
export class ReportContainerComponent implements OnInit {

    public reportId;
    constructor(private route: ActivatedRoute,private reportService: ReportViewService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.reportId = +params.get('reportId');
      this.reportService.setReportId(this.reportId);
    });
    this.reportService.sheetDetailsUpdated.subscribe((ele:Array<any>)=>{
      this.tabs = ele
    })
    this.reportService.getSheetData();
 

  }

  tabs = [];
  selected = new FormControl(0);

  addTab() {
    this.tabs.push({ name : 'Sheet '+ (this.tabs.length + 1) , type: '' });
    this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
