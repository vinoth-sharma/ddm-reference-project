import { Component, OnInit } from "@angular/core";
import { ReportbuilderService } from "../reportbuilder.service";
import { SemanticReportsService } from "./semantic-reports.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import Utils from "../../utils";

@Component({
  selector: "app-semantic-reports",
  templateUrl: "./semantic-reports.component.html",
  styleUrls: ["./semantic-reports.component.css"]
})
export class SemanticReportsComponent implements OnInit {
  public reportList: any;
  public isLoading: boolean;
  public allChecked: boolean;
  public semantic_id: number;
  public p: number = 1;
  public collection: any[];
  public reportType = "report_name";
  public report: any = [];
  public type;
  public confirmFn;
  public confirmText;
  public selectedReports = [];
  public reportColumn = [
   'Report Name',
    'Modified On',
   'Modified By',
    'Scheduled By'
  ]

  constructor(
    private toasterService: ToastrService,
    private semanticReportsService: SemanticReportsService,
    private router: Router
  ) {}

  /**
   * selectCheckbox
   */
  public selectCheckbox() {
    this.allChecked = !this.allChecked;
    this.reportList.forEach(element => {
      element.checked = this.allChecked;
    });
  }

  /**
   * isAllChecked
   */
  public isAllChecked(report) {
    report.checked = !report.checked;
    this.selectedReports = this.reportList.filter((element,key) => {
        return element.checked;
    });
    this.allChecked = this.reportList.every(data => data["checked"]);
  }

  ngOnInit() {
    this.getSemanticId();
    this.getReportLists();
  }

  /**
   * get semantic id from router
   */
  public getSemanticId() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semantic_id = element.data["semantic_id"];
      }
    });
  }

  /**
   * getReportList
   */
  public getReportLists() {
    this.isLoading = true;
    this.semanticReportsService.getReportList(this.semantic_id).subscribe(
      res => {
        this.isLoading = false;
        this.reportList = res["data"];
        this.collection = this.reportList;
      },
      err => {
        this.isLoading = false;
        this.toasterService.error(err.message["error"]);
      }
    );
  }

  /**
   * sort
   */
  public sort(typeVal) {
    this.reportType = typeVal;
    this.report[typeVal] = this.report[typeVal] == "" || this.report[typeVal] == undefined?'reverse':"";
    this.type = typeVal;
  }

  public deleteReport(report_id, i) {
    this.confirmText = "Are you sure you want to delete the report?";
    report_id =  Array.isArray(report_id)?report_id:[report_id];
    i = Array.isArray(i)?i:[i];
    let option = {
      report_list_id: report_id
    }
    this.confirmFn = function() {
      Utils.showSpinner();
      this.semanticReportsService.deleteReportList(option).subscribe(
        res => {
          this.toasterService.success(res["message"]);
          this.getReportLists();
          Utils.hideSpinner();
          Utils.closeModals();
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
          Utils.hideSpinner();
          Utils.closeModals();
        }
      );
    };
  }

  /**
   * getSelectedReports
   */
  public getSelectedReports() {
    let checkedReport = [];
    let checkedKeys = [];
    this.reportList.forEach((element,key) => {
      if(element.checked){
        checkedReport.push(element.report_list_id);
        checkedKeys.push(key);
      }
    });
    this.deleteReport(checkedReport,checkedKeys);
  }
}