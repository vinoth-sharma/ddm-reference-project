import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { Router, ActivatedRoute } from "@angular/router";
import { SemdetailsService } from "../../../semdetails.service";
import { AuthenticationService } from "../../../authentication.service";
import { ObjectExplorerSidebarService } from "./object-explorer-sidebar.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-object-explorer-sidebar",
  templateUrl: "./object-explorer-sidebar.component.html",
  styleUrls: ["./object-explorer-sidebar.component.css"]
})
export class ObjectExplorerSidebarComponent implements OnInit {
  public columns = [];
  public button;
  public isShow = false;
  public semantic_name;
  public isCollapsed = false;
  public isLoading: boolean;
  public reports = [];
  public selectedTable;
  public originalTables;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private semanticService: SemdetailsService,
    private toasterService: ToastrService
  ) {
    this.semanticService.myMethod$.subscribe(columns => {
      this.columns = columns;
      this.originalTables = JSON.parse(JSON.stringify(this.columns));
    });
  }

  ngOnInit() {
    this.semantic_name = this.activatedRoute.snapshot.data["semantic"];
    $(document).ready(function() {
      $("#sidebarCollapse").on("click", function() {
        $("#sidebar").toggleClass("active");
      });
    });
  }

  show(i) {
    this.button = i;
    this.isShow = !this.isShow;
  }

  public toggle() {
    $("#sidebar").toggleClass("active");
  }

  public renameTable(obj, type) {
    let options = {};
    options["table_id"] = obj.table_id;
    options["sl_id"] = this.activatedRoute.snapshot.data["semantic_id"];
    if (type == "column") {
      options["old_column_name"] = obj.old_val;
      options["new_column_name"] = obj.table_name;
      this.objectExplorerSidebarService.saveColumnName(options).subscribe(
        res =>
          this.toasterService.success(
            "Column rename has been changed successfully"
          ),
        err => {
          this.toasterService.error(
            err.message || "There seems to be an error. Please try again later."
          );
        }
      );
    } else {
      options["table_name"] = obj.table_name;
      this.objectExplorerSidebarService.saveTableName(options).subscribe(
        res =>
          this.toasterService.success(
            "Table rename has been changed successfully"
          ),
        err => {
          this.toasterService.error(
            err.message || "There seems to be an error. Please try again later."
          );
        }
      );
    }
  }

  public getDependentReports(tableId) {
    this.isLoading = true;
    this.selectedTable = tableId;
    this.objectExplorerSidebarService.getReports(tableId).subscribe(
      response => {
        this.reports = response["dependent_reports"];
        this.isLoading = false;
      },
      error => {
        this.toasterService.error(
          error.message || "There seems to be an error. Please try again later."
        );
      }
    );
  }

  public deleteTable() {
    this.objectExplorerSidebarService.deleteTable(this.selectedTable).subscribe(
      response => {
        this.getTables();
        this.toasterService.success("Table deleted successfully");
      },
      error => {
        this.toasterService.error(
          error.message || "There seems to be an error. Please try again later."
        );
      }
    );
  }

  public getTables() {
    let semantic_id = this.activatedRoute.snapshot.data["semantic_id"];
    this.semanticService.fetchsem(semantic_id).subscribe(
      response => {
        this.columns = response["data"]["sl_table"];
      },
      error => {
        this.toasterService.error(
          error.message || "There seems to be an error. Please try again later."
        );
      }
    );
  }

  public searchTableList(key) {
    let results = [];
    if (key != "" || key != undefined) {
      results = this.originalTables.filter(ele => {
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
    this.columns = results;
  }
}
