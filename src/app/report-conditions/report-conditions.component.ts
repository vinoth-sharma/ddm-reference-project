import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-conditions',
  templateUrl: './report-conditions.component.html',
  styleUrls: ['./report-conditions.component.css']
})
export class ReportConditionsComponent implements OnInit {

  conditions = [
    { name: 'Model Year Number 2019', id: 1 },
    { name: 'Allocation Group Code', id: 2 },
    { name: 'Business Org Category', id: 3 }
  ]
  isReadonly: boolean = true;

  constructor() { }

  ngOnInit() { }

}
