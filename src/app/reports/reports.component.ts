import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  template: `<div id="semantic-reports-wrapper">
              <router-outlet></router-outlet>
            </div>`,
//   styles: [`#semantic-reports-wrapper {
//     height: 100%;  
// }`]

  
})

export class ReportsComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
