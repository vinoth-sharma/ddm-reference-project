import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as $ from "jquery";
import { SemanticReportsService } from "../semantic-reports/semantic-reports.service";

@Component({
  selector: "app-semantic-layer-main",
  templateUrl: "./semantic-layer-main.component.html",
  styleUrls: ["./semantic-layer-main.component.css"]
})

export class SemanticLayerMainComponent implements OnInit {

  public isReportsActive: boolean = false;
  public isDqm: boolean = false;
  constructor(private activatedRoute: ActivatedRoute,private semanticReportsService: SemanticReportsService) { }

  ngOnInit() {
    $(document).ready(function () {
      $("#sidebarCollapse").on("click", function () {
        $("#sidebar").toggleClass("active");
      });
    });
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