import { Component, OnInit } from '@angular/core';

import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class ViewComponent implements OnInit {

  joins = [];

  constructor(private sharedDataService: SharedDataService) { }

  ngOnInit() { 
    this.joins = this.sharedDataService.getJoin();
  }
}
