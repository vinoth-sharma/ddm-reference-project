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

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private sharedDataService: SharedDataService) { 
    // router.events.subscribe((val) => {
    //   console.log('in router'+val)
    //   console.log(NavigationEnd);
    //   if(val instanceof NavigationEnd){
    //     console.log(val,'in for');
    //     if(val.url == '/semantic/sem-reports/create-report/preview'){
    //       this.show = false;
    //     }else{
    //       this.show = true;
    //     }
    //   }
    //   // this.show = in routerNavigationEnd(id: 8, url: '/semantic/sem-reports/create-report/preview', urlAfterRedirects: '/semantic/sem-reports/create-report/preview')
    //   // if(val['NavigationEnd'].url == '/semantic/sem-reports/create-report/preview'){
    //   //   console.log('this is preview');
    //   // }
    // })
  }

  ngOnInit() {
    // TODO: jquery 
    $("#sidebar").toggleClass("active");

    this.sharedDataService.setSelectedTables([]);
  }

  public showNav() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.show = (this.activatedRoute.snapshot['firstChild']['url'][0]['path'] !== 'select-tables') ? true : false;
      }
    });
  }

  public navigateToPreview(){
    this.router.navigate(['semantic/sem-reports/preview']);
  }

}