import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  template: `<div id="semantic-reports-wrapper">
              <router-outlet></router-outlet>
            </div>`,
  styleUrls: ['./reports.component.css']

  
})

export class ReportsComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
