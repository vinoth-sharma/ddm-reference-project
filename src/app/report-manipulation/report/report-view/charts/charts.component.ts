import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  btnToggled(event){
    // this.selectedTab = event.value;
    console.log(event);
    let selected = event.value;
    
  }
}
