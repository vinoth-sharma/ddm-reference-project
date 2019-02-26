import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import * as $ from "jquery";

@Component({
  selector: 'app-create-report-layout',
  templateUrl: './create-report-layout.component.html',
  styleUrls: ['./create-report-layout.component.css']
})

export class CreateReportLayoutComponent implements OnInit {

  show: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // TODO: jquery 
    $("#sidebar").toggleClass("active");
  }

  public goToView() {
    if (this.activatedRoute.snapshot['firstChild']) {
      this.show = (this.activatedRoute.snapshot['firstChild']['url'][0]['path'] !== 'select-tables') ? true : false;
    }
    
    // TODO: dynamic routing 
    this.router.navigate(['semantic/sem-reports/create-report/add-conditions']);
  }

}
