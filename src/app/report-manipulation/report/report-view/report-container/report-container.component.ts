import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

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

}
