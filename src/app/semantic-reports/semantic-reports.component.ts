import { Component, OnInit, ViewChildren } from "@angular/core";
import { ReportbuilderService } from "../reportbuilder.service";
import { SemanticReportsService } from "./semantic-reports.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import Utils from "../../utils";
import { InlineEditComponent } from "../shared-components/inline-edit/inline-edit.component";
import { QueryList } from "@angular/core";

@Component({
  selector: "app-semantic-reports",
  templateUrl: "./semantic-reports.component.html",
  styleUrls: ["./semantic-reports.component.css"]
})
export class SemanticReportsComponent implements OnInit {
  public reportList: any;
  public isLoading: boolean;
  public allChecked: boolean;
  public semanticId: number;
  public pageNum: number = 1;
  public reportType = "report_name";
  public report: any = [];
  public type;
  public confirmFn;
  public confirmText;
  public selectedReports = [];
  public noData: boolean = false;
  public pageData;
  public reportColumn = [
    "Report Name",
    "Modified On",
    "Modified By",
    "Scheduled By"
  ];
  public datePipe = new Date();
  @ViewChildren("editName") editNames: QueryList<InlineEditComponent>;

  constructor(private toasterService: ToastrService, private semanticReportsService: SemanticReportsService, private router: Router) {}


  ngOnInit() {
    this.getSemanticId();
    this.getReportLists();
  }

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
    this.selectedReports = this.reportList.filter( element => { return element.checked; });
    this.allChecked = this.reportList.every(data => data["checked"]);
  }


  /**
   * get semantic id from router
   */
  public getSemanticId() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
  }

  /**
   * getReportList
   */
  public getReportLists() {
    this.noData = false;
    this.isLoading = true;
    this.semanticReportsService
      .getReportList(this.semanticId, this.pageNum)
      .subscribe(
        res => {
          this.isLoading = false;
          this.reportList = res["data"]["list"];

          this.reportList.forEach(element => {
            element.modified_on = new Date(element.modified_on);
          });
          if (!this.reportList.length) this.noData = true;

          this.pageData = {
            totalCount: res["count"],
            perPage: res["per_page"]
          };
        },
        err => {
          this.isLoading = false;
          this.reportList = [];
          this.toasterService.error(err.message["error"]);
        }
      );
  }

  /**
   * sort
   */
  public sort(typeVal) {
    this.reportType = typeVal.toLowerCase().replace(/\s/g, "_");;
    this.report[typeVal] =
      this.report[typeVal] == "" || this.report[typeVal] == undefined
        ? "reverse"
        : "";
    this.type = typeVal;
  }

  public deleteReport(report_id) {
    this.confirmText = "Are you sure you want to delete the report?";

    report_id = Array.isArray(report_id) ? report_id : [report_id];

    let option = {
      report_list_id: report_id
    };
    
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
    this.reportList.forEach(element => {
      if (element.checked) 
        checkedReport.push(element.report_list_id);
    });
    this.deleteReport(checkedReport);
  }

  /**
   * enableRename
   */
  public enableRename(report, i) {
    this.reportList.forEach(element => {
      if(report.report_list_id == element.report_list_id)
        element.isEnabled = true;
      else
        report.isEnabled = false;
    });
    
    this.editNames["_results"][i].onDblClick();
  }

  /**
   * renameReport
   */
  public renameReport(val) {
    let option = {
      report_list_id: val.table_id,
      report_name: val.table_name
    };
    Utils.showSpinner();
    this.semanticReportsService.renameReport(option).subscribe(
      res => {
        this.toasterService.success(res["message"]);
        Utils.hideSpinner();
      },
      err => {
        this.toasterService.error(err.message["error"]);
      }
    );
  }

  public pageChange(e) {
    this.pageNum = e;
    this.getReportLists();
  }
}
