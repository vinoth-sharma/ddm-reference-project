import { Component, OnInit, Input } from '@angular/core';
import { SemanticReportsService } from '../semantic-reports/semantic-reports.service';
declare var $: any;

@Component({
  selector: 'app-reports-navbar',
  templateUrl: './reports-navbar.component.html',
  styleUrls: ['./reports-navbar.component.css']
})

export class ReportsNavbarComponent implements OnInit {
  @Input() selReportId: string;
  @Input() selReportName: string;
  public isLoading: boolean = true;
  public query;
  public queryDetails: string;
  constructor(
  private semanticReportsService: SemanticReportsService) { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.selReportId) {
      this.getQuery();
    }
  }

  public getQuery() {
    this.isLoading = true;
    this.semanticReportsService.getReportQuery(this.selReportId).subscribe(res => {
      console.log("query",res)
      this.query = res['queries'];
      this.isLoading = false;
    })
  }

  formDescription() {
    var a = document.getElementById("text");
    this.queryDetails = a.innerText;
  }

  downloadQuery() {
    this.formDescription();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.queryDetails));
    element.setAttribute('download', `${this.selReportName}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    $('#viewQuery').modal('hide');
  }
}
