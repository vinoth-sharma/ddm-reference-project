import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";

@Component({
  selector: "app-semantic-layer-main",
  templateUrl: "./semantic-layer-main.component.html",
  styleUrls: ["./semantic-layer-main.component.css"]
})

export class SemanticLayerMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(function () {
      $("#sidebarCollapse").on("click", function () {
        $("#sidebar").toggleClass("active");
      });
    });
  }

}