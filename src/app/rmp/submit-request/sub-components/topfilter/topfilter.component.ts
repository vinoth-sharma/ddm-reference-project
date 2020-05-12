import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-topfilter',
  templateUrl: './topfilter.component.html',
  styleUrls: ['./topfilter.component.css']
})
export class TopfilterComponent implements OnInit {

  constructor() { }
  @Input() filters: string[];
  @Input() title: string;
  @Input() userProfile: object[];
  
  compareWithFunc(a, b) {
    return a.name === b.name;
  }
  
  ngOnInit(): void {
  }

}
