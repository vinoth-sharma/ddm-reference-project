import { Component, OnInit } from "@angular/core";
import { ActivatedRoute , Router} from "@angular/router";
import * as $ from "jquery";

import { SemanticReportsService } from "../semantic-reports/semantic-reports.service";
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: "app-semantic-layer-main",
  templateUrl: "./semantic-layer-main.component.html",
  styleUrls: ["./semantic-layer-main.component.css"]
})

export class SemanticLayerMainComponent implements OnInit {

  public isReportsActive: boolean = false;
  public isDqm: boolean = false;
  public routeValue: boolean = false;
  public isButton: boolean = false;
  public userRole;
  constructor(private activatedRoute: ActivatedRoute, 
              private semanticReportsService: SemanticReportsService, 
              private authenticationService: AuthenticationService,
              private router: Router
              ) { 
                this.authenticationService.myMethod$.subscribe(role =>{
                  if (role) {
                    this.userRole = role["role"];
                  }
                })
               }

  ngOnInit() {
    $(document).ready(function () {
      $("#sidebarCollapse").on("click", function () {
        $("#sidebar").toggleClass("active");
      });
    });
    this.authenticationService.button$.subscribe((isButton) => this.isButton = isButton )
  }

  public showReportsNav() {
    if (this.activatedRoute.snapshot['firstChild']) {
      this.isReportsActive = (this.activatedRoute.snapshot['firstChild']['url'][0]['path'] === 'sem-reports') ? true : false;
    }
  }
  public checkRoute() {
    this.routeValue = false;
    this.authenticationService.setSlRoute(this.routeValue);
  }

  public setDqm(value:boolean){
    // if(value){
    //   this.semanticReportsService.isDqm = true;
    // }
    // else{
    //   this.semanticReportsService.isDqm = false;
    // }
    this.semanticReportsService.isDqm = value;
  }

}