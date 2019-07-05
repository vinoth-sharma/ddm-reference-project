import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-report-container',
  templateUrl: './report-container.component.html',
  styleUrls: ['./report-container.component.scss']
})
export class ReportContainerComponent implements OnInit {

    public reportId;
    constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.reportId = +params.get('reportId');
    });
  }
  tabs = [{ name : 'Sheet 1'}];
  selected = new FormControl(0);

  addTab() {
    this.tabs.push({ name : 'Sheet '+ (this.tabs.length + 1) });
    this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
