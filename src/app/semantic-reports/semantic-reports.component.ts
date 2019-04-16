import { Component, OnInit, ViewChildren } from "@angular/core";
import { ReportbuilderService } from "../reportbuilder.service";
import { SemanticReportsService } from "./semantic-reports.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import Utils from "../../utils";
import { InlineEditComponent } from "../shared-components/inline-edit/inline-edit.component";
import { QueryList } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { SharedDataService } from "../create-report/shared-data.service";

@Component({
  selector: "app-semantic-reports",
  templateUrl: "./semantic-reports.component.html",
  styleUrls: ["./semantic-reports.component.css"]
})
export class SemanticReportsComponent implements OnInit {
  public reportColumn: any = [];
  public reportList: any = [];
  public selectedId;
  public reportListCopy: any;
  public isLoading: boolean;
  public tagsData;
  public reportId;
  public userId;
  public allChecked: boolean;
  public semanticId: number;
  public pageNum: number = 1;
  public report: any = [];
  public param = "open_count";
  public orderType = 'desc';
  public confirmFn;
  public confirmHeader: string = '';
  public confirmText;
  public selectedReports = [];
  public noData: boolean = false;
  public pageData;
  public allReportList = [];
  public description;
  public searchType: string = 'By Name';
  public paginationData:any = {};

  @ViewChildren("editName") editNames: QueryList<InlineEditComponent>;

  constructor(
    private toasterService: ToastrService, 
    private sharedDataService:SharedDataService,
    private user: AuthenticationService, 
    private semanticReportsService: SemanticReportsService, private router: Router) { }


  ngOnInit() {
    this.reportColumn.push("Report Name", "Modified On", "Modified By", "Scheduled By");
    this.getIds();
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
    this.selectedReports = this.reportList.filter(element => { return element.checked; });
  }

  /**
   * isAllChecked
   */
  public isAllChecked(report) {
    report.checked = !report.checked;
    this.selectedReports = this.reportList.filter(element => { return element.checked; });
    this.allChecked = this.reportList.every(data => data["checked"]);
  }


  /**
   * get semantic id from router
   */
  public getIds() {
    this.user.errorMethod$.subscribe((id) =>
      this.userId = id);
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
      .getReportList(this.semanticId,this.userId)
      .subscribe(
        res => {
          this.isLoading = false;
          this.reportList = res["data"]["report_list"];
          this.reportListCopy = JSON.parse(JSON.stringify(this.reportList));

          this.reportList.forEach(element => {
            element.modified_on = new Date(element.modified_on);
          });
          if (!this.reportList.length) this.noData = true;

          this.pageData = {
            totalCount: res["data"]["report_list"].length,
            perPage: 5
          };
          this.updatePagination();
          this.allReportList = res['data']['active_reports'];
          this.sharedDataService.setReportList(this.allReportList);
        },
        err => {
          this.isLoading = false;
          this.reportList = [];
          this.toasterService.error(err.message["error"]);
        }
      );
  }

  public saveDescription(param) {
    Utils.showSpinner();
    var reportInfo;
    if (param.OriginalValue !== param.ChangedValue) {
      reportInfo = {
        "report_list_id": this.selectedId,
        "description": param.ChangedValue,
      }
      this.semanticReportsService.updateReport(reportInfo).subscribe(result => {
        this.toasterService.success("Information updated");
        Utils.hideSpinner();
        Utils.closeModals();
        this.reportList.forEach(ele => {
          if (this.selectedId == ele.report_list_id) {
            ele.description = param.ChangedValue;
          }
        });
      }, error => {
        this.toasterService.error(error.message["error"]);
        Utils.hideSpinner();
        Utils.closeModals();
      })
    } else {
      this.toasterService.error("Information is same");
      Utils.hideSpinner();
      Utils.closeModals();
    }
  }
  /**
   * sort
   */
  public sort(typeVal) {
    this.param = typeVal.toLowerCase().replace(/\s/g, "_");;
    this.report[typeVal] = !this.report[typeVal] ? "reverse" : "";
    this.orderType = this.report[typeVal];
  }

  public deleteReport(report_id) {
    this.confirmText = "Are you sure you want to delete the report?";
    this.confirmHeader = "Delete report";
    report_id = Array.isArray(report_id) ? report_id : [report_id];

    let option = {
      report_list_id: report_id
    };

    this.confirmFn = function () {
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
      if (report.report_list_id == element.report_list_id)
        element.isEnabled = true;
      else
        element.isEnabled = false;
    });

    this.editNames["_results"][i].onDblClick();
  }

  /**
   * renameReport
   */
  public renameReport(val) {
    if (this.checkDuplicate(val.table_name))
      this.toasterService.error('Column already selected');
    else {
      let option = {
        report_list_id: val.table_id,
        report_name: val.table_name
      };
      Utils.showSpinner();
      this.semanticReportsService.renameReport(option).subscribe(
        res => {
          this.toasterService.success(res["message"]);
          Utils.hideSpinner();
          this.reportList.forEach(element => {         
            if(element.isEnabled){
              element.report_name = val.table_name;
            }
            element.isEnabled = false;
          });
        },
        err => {
          this.toasterService.error(err.message["error"]);
        }
      );
    }
  }

  public checkDuplicate(name) {
    return this.allReportList.includes(name);
  }


  public setSearchValue(value) {
    this.searchType = value;
    this.reportList = JSON.parse(JSON.stringify(this.reportListCopy));
    document.getElementById("searchText")['value'] = '';
    this.noData = false;
    this.updatePagination();
  }

  public searchData(key) {
    let data = [];
    if (key && key.length > 2) {
      if (this.searchType == 'By Tag') {
        this.reportListCopy.filter(element => {
          if (element.tags.length) {
            let result = element.tags.find(function (ele) {
              if (ele) {
                return ele.toString().toLowerCase().match(key.toString().toLowerCase());
              }
            })
            if (result) {
              this.noData = false;
              data.push(element);
            }
            else {
              if (!data.length) {
                this.noData = true;
              }
            }
          }
        })
      } else {
        this.reportListCopy.forEach(ele => {
          ele.modified_on = new Date(ele.modified_on).toString();
        });
        this.reportListCopy.filter(element => {
          if ((element.report_name && element.report_name.toLowerCase().match(key.toLowerCase())) ||
            (element.modified_by && element.modified_by.toLowerCase().match(key.toLowerCase())) ||
            (element.modified_on && element.modified_on.toLowerCase().match(key.toLowerCase())) ||
            (element.scheduled_by && element.scheduled_by.toLowerCase().match(key).toLowerCase())) {
            this.noData = false;
            data.push(element);
          }
        })
      }
    } else {
      data = JSON.parse(JSON.stringify(this.reportListCopy));
      this.noData = false;
    }
    if (!data.length) {
      this.noData = true;
    }
    this.reportList = data;
    this.updatePagination();
  }

  public saveTags(data) {
    Utils.showSpinner();
    let tagsData = {
      report_list_id: this.reportId,
      tag_name: data.tag_name
    }
    this.semanticReportsService.saveTags(tagsData).subscribe(
      res => {
        this.getReportLists();
        this.toasterService.success(res['message']);
        Utils.hideSpinner();
      },
      err => {
        this.toasterService.error(err.message["error"]);
        Utils.hideSpinner();
      }
    )
  }

  /**
   * storeFrequency
   */
  public storeFrequency(id) {
    let data = {
      "report_frequency_id" : id
    }
    this.semanticReportsService.storeFrequencyCount(data).subscribe(
      res => {
        
      },
      err => {

      })
  }

  public updatePagination(){
    this.paginationData = {
      itemsPerPage: this.pageData.perPage,
      currentPage: this.pageNum, 
      totalItems: this.reportList.length}
  }

  public pageChange(pNum){
    this.pageNum = pNum;
    this.updatePagination();
  }

  // edit option
  // public openReport(id){
  //   this.router.navigate(['semantic/sem-reports/create-report', id]);
  // }

  public goToReport(reportId:number){
    this.router.navigate(['semantic/sem-reports/view/insert', reportId]);
  }
}
