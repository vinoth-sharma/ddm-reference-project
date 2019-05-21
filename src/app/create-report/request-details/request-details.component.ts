import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit {

  @Input() details: any = {};
  
  constructor() { }

  ngOnInit() {
  }

}
