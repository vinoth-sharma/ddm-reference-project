import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import * as $ from "jquery";

import { SharedDataService } from "../shared-data.service";

@Component({
  selector: 'app-create-report-layout',
  templateUrl: './create-report-layout.component.html',
  styleUrls: ['./create-report-layout.component.css']
})

export class CreateReportLayoutComponent implements OnInit {

  show: boolean;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedDataService: SharedDataService) { }

  ngOnInit() {
    // TODO: jquery 
    $("#sidebar").toggleClass("active");

    // this.sharedDataService.setSelectedTables([]);
    this.sharedDataService.updateTables([]);
  }

  public showNav() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.show = (this.activatedRoute.snapshot['firstChild']['url'][0]['path'] !== 'select-tables') ? true : false;
      }
    });
  }

}