import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
  public isButton: boolean = false;
  constructor(private activatedRoute: ActivatedRoute, 
              private semanticReportsService: SemanticReportsService, 
              private authenticationService: AuthenticationService,
              ) { }

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

  public setDqm(value:number){
    if(value){
    this.semanticReportsService.isDqm = true;
    }
    else{
      this.semanticReportsService.isDqm = false;
    }
  }

}