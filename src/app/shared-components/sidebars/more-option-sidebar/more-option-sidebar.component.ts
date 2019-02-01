import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-more-option-sidebar",
  templateUrl: "./more-option-sidebar.component.html",
  styleUrls: ["./more-option-sidebar.component.css"]
})
export class MoreOptionSidebarComponent implements OnInit {
  public showSidebar: boolean;

  constructor(
    private route: Router
  ) {}

  ngOnInit() {}

  public toggle() {
    this.showSidebar = !this.showSidebar;
  }

  public openJoinOption() {
    this.route.navigate(["semantic/sem-reports/create-report"]);
  }
}