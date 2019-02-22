import { Component, OnInit } from '@angular/core';
import { ReportConditionsService } from './report-conditions.service';

@Component({
  selector: 'app-report-conditions',
  templateUrl: './report-conditions.component.html',
  styleUrls: ['./report-conditions.component.css']
})

export class ReportConditionsComponent implements OnInit {

  conditions = [
    { name: 'Model Year Number 2019', id: 1 },
    { name: 'Allocation Group Code 1', id: 2 },
    { name: 'Allocation Group Code 2', id: 3 },
    { name: 'Business Org Category 1', id: 4 },
    { name: 'Model Year Number 2018', id: 5 },
    { name: 'Allocation Group Code 3', id: 6 },
    { name: 'Business Org Category 1', id: 7 },
    { name: 'Model Year Number 2017', id: 8 },
    { name: 'Allocation Group Code 5', id: 9 },
    { name: 'Business Org Category 3', id: 10, checked: "true" }
  ]
  selected: string;

  constructor(private reportConditionsService: ReportConditionsService) { }

  ngOnInit() { }

  public getConditions(tableName: string) {
    this.reportConditionsService.getConditions(tableName).subscribe(response => {
      // this.conditions = response['data']['sl_view'];
      // this.cachedConditions = JSON.parse(JSON.stringify(this.conditions))
      console.log('getConditions', response)
    }, error => {
      // this.toasterService.error(error.message || this.defaultError);
    })
  }

  public getFilteredList(searchText: string) {
    console.log('getFiltered', searchText);
  }

}
