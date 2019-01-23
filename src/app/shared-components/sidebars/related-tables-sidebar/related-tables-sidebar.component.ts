import { Component, OnInit, Input } from "@angular/core";
import { SidebarToggleService } from "../../../sidebar-toggle.service";

@Component({
  selector: "app-related-tables-sidebar",
  templateUrl: "./related-tables-sidebar.component.html",
  styleUrls: ["./related-tables-sidebar.component.css"]
})
export class RelatedTablesSidebarComponent implements OnInit {
  public showSidebar: boolean;
  public relatedTables: any;
  public isTableEmpty: boolean;
  public isCollapsed;
  public button;
  public isShow;
  public originalTables;

  constructor(private toggleService: SidebarToggleService) {}

  ngOnInit() {
    this.isShowRelatedSidebar();
    this.getOriginalTables();
    this.getRelatedTables();
  }

  /**
   * isShowRelatedSidebar
   */
  public isShowRelatedSidebar() {
    this.toggleService.$toggle.subscribe(val => {
      this.showSidebar = val;
    });
  }

  /**
   * getOriginalData
   */
  public getOriginalTables() {
    this.toggleService.$originalRelatedData.subscribe(val => {
      this.originalTables = val;
    });
  }

  /**
   * getRelatedTables
   */
  public getRelatedTables() {
    this.toggleService.$relatedData.subscribe(val => {
      this.relatedTables = val;
      if (this.relatedTables) {
          this.isTableEmpty = this.relatedTables.length != 0?false:true;
      }
    });
  }

  /**
   * toggle search input
   */
  public getSearchInput() {
    let inputFocus;
    this.isCollapsed = !this.isCollapsed;
    if (!this.isCollapsed) {
      this.relatedTables = JSON.parse(JSON.stringify(this.originalTables));
    } else {
      setTimeout(() => {
        inputFocus = document.querySelectorAll("input#tableIdSearch");
        inputFocus[0].style.display = "block";
        inputFocus[0].focus();
      });
    }
  }

  /**
   * toggle related table sidear
   */
  public toggle() {
    this.toggleService.setToggle(false);
  }

  /**
   * toggle table related columns
   */
  showColumns(i) {
    this.button = i;
    this.isShow = !this.isShow;
  }

  /**
   * isShowRelatedSidebar
   */
  public searchTableList(key) {
    let results = [];
    if (key != "" || key != undefined) {
      results = JSON.parse(JSON.stringify(this.originalTables)).filter(ele => {
        if (ele.mapped_table_name.toLowerCase().match(key.toLowerCase())) {
          return ele;
        } else {
          ele.mapped_column_name = ele.mapped_column_name.filter(data => {
            return data.toLowerCase().match(key.toLowerCase());
          });
          if (ele.mapped_column_name.length != 0) {
            return ele;
          }
        }
      });
    } else {
      results = JSON.parse(JSON.stringify(this.originalTables));
    }
    this.relatedTables = results;
  }
}
