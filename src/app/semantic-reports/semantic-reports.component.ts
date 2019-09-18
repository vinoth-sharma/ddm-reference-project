import { Component, OnInit, ViewChildren, ViewChild } from "@angular/core";
import { SemanticReportsService } from "./semantic-reports.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
declare var $:any;

import Utils from "../../utils";
import { InlineEditComponent } from "../shared-components/inline-edit/inline-edit.component";
import { QueryList } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { SharedDataService } from "../create-report/shared-data.service";
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { SelectSheetComponent } from '../create-report/select-sheet/select-sheet.component';
import { DjangoService } from '../../app/rmp/django.service'

@Component({
  selector: "app-semantic-reports",
  templateUrl: "./semantic-reports.component.html",
  styleUrls: ["./semantic-reports.component.css"]
})
export class SemanticReportsComponent implements OnInit {

  // private createdBy: string = '';
  // private userIds: any[] = []
  public nameReport;
  public reportList: any = [];
  public closeDailog;
  public selectedId;
  public reportListCopy: any;
  public isLoading: boolean;
  // public tagsData;
  public reqReport;
  public id;
  public userId;
  public selected_report_sheet = [];
  public semanticId: number;
  public confirmFn;
  public confirmHeader: string = '';
  public confirmText;
  public noData: boolean = false;
  public allReportList = [];
  public description:string = '';
  public searchType: string = 'By Name';
  public isDqmValue:boolean = false;
  public selectedReqId : any ;
  public reportName:string;
  public reportListIdToSchedule:number;
  public existingTags: any;
  public dataSource;
  public name;
  public displayedColumn= [];
  public sheet_names = [];
  public sheet_ids = [];
  public selection = new SelectionModel(true, []);
  public idReport;
  public requestIds: any;

  public notificationChoice = [
    {'value': 'true', 'display': 'Yes'},
    {'value': 'false', 'display': 'No'},
  ];
  // public sheet_names:any;
  // public sheet_ids:any;

  errData:boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren("editName") editNames: QueryList<InlineEditComponent>;

  constructor(
    private sharedDataService:SharedDataService,
    private toasterService:ToastrService,
    private user: AuthenticationService, 
    private semanticReportsService: SemanticReportsService,
    private router: Router,
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private dialog: MatDialog,
    private djangoService: DjangoService
  ) { }


  ngOnInit() {
    this.getIds();
    this.objectExplorerSidebarService.$refreshState.subscribe(val => {
        if(val === 'reportList') {
          this.getReportList();
          // console.log("ALL REPORTS WITH SL",val);
        }
    });
    this.objectExplorerSidebarService.getName.subscribe((semanticName) => {
      this.checkErr();
    });


    /// call django's list of reports
    let obj = {
      page_no: 1,
      per_page: 200,
      sort_by: ""
    }
    this.djangoService.list_of_reports(obj).subscribe(res=>{
      if(res && this.userId){
        this.user.fun(this.userId).subscribe(userInfo=>{
          if(userInfo){
            // console.log("List of the reports",res);
            // console.log("userInfo obtained!!!",userInfo);
            let tempResults = res['report_list']
            this.requestIds = [];
            let assignedTo = userInfo['user']['first_name'] + ' ' + userInfo['user']['last_name'] 
            // console.log("Assigned to owner : ",assignedTo)
            tempResults.map(i=>{if(i.assigned_to == assignedTo && i.status == "Active") {
              // "Active"
              this.requestIds.push(i.ddm_rmp_post_report_id);
              // console.log("added data",i.ddm_rmp_post_report_id)
            }
            })
          }
        })
      

      }
    })

  }

  public setRequestId(selectedReqId){
    // console.log("Selcetd request id : ",selectedReqId);
    if(selectedReqId != '-1' || selectedReqId != '')
    this.sharedDataService.setRequestId(selectedReqId);
  }

  /**
   * get semantic id from router
   */
  public getIds() {
    this.user.errorMethod$.subscribe((id) => this.userId = id);
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
  }

  /**
   * getReportList
   */
  public getReportList() {
    this.noData = false;
    this.isLoading = true;
    this.isDqmValue = this.semanticReportsService.isDqm;
    this.semanticReportsService
      .getReportList(this.semanticId,this.userId)
      .subscribe(
        res => {
          this.isLoading = false;
          this.reportList =  res["data"]["report_list"].filter(element => {
            if(!element.is_dqm && !this.isDqmValue){
              return element
            }else if(element.is_dqm && this.isDqmValue){
              return element;
            }
          });
          this.modifyReport();
          this.allReportList = res['data']['active_reports'];
          this.sharedDataService.setReportList(this.allReportList);
          // console.log("res",res);
        },
        err => {
          this.isLoading = false;
          this.reportList = [];
          this.dataSource = new MatTableDataSource(this.reportList);
          this.toasterService.error(err.message["error"]);
        }
      );
  }

  // update reportList
  private modifyReport(){
    this.reportList = this.reportList.sort((a , b) =>{
      return (b.open_count - a.open_count);
    } );
    this.reportListCopy = JSON.parse(JSON.stringify(this.reportList));
    this.reportList.forEach(element => {
      element.modified_on = new Date(element.modified_on);
      element.isEnabled = false;
    });
    if (!this.reportList.length) this.noData = true;

    this.displayedColumn = ["select","report_name", "modified_on", "modified_by", "scheduled_by", "actions"];
    this.dataSource = new MatTableDataSource(this.reportList);
    this.dataSource.paginator = this.paginator;
    if(this.sort){
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => 
      {
        if(typeof data[sortHeaderId] === 'string')
          return data[sortHeaderId].toLocaleLowerCase();
  
          return data[sortHeaderId];
      }
      this.sort.disableClear = true;
    }
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
          if (this.selectedId == ele.report_id) {
            ele.description = param.ChangedValue;
          }
        });
      }, error => {
        this.toasterService.error(error.message["error"]);
        Utils.hideSpinner();
      })
    } else {
      this.toasterService.error("Information is same");
      Utils.hideSpinner();
      Utils.closeModals();
    }
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
          this.getReportList();
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
    // this.reportList.forEach(element => {
    //   if (element.checked) 
    //     checkedReport.push(element.report_id);
    // });

    this.selection.selected.forEach(element => {
        checkedReport.push(element.report_id);
      });
    this.deleteReport(checkedReport);
  }

  /**
   * enableRename
   */
  public enableRename(report, i) {
    this.reportList.forEach(element => {
      if (report.report_id === element.report_id){
        element.isEnabled = true;
      }else
        element.isEnabled = false;
    });

    this.editNames["_results"][i].onDblClick();
    let inputFocus;
      setTimeout(() => {
        inputFocus = document.getElementById("rename-"+i);
        inputFocus['firstChild'].style.display = 'block';
        inputFocus['firstChild'].focus();
      });
  }

  /**
   * renameReport
   */
  public renameReport(val,i) {
    if(val.table_name.trim() === val.old_val.trim()) {
      this.toasterService.error('Please enter a new name');
      return;
    }else {
      if (this.checkDuplicate(val.table_name.trim()))
      this.toasterService.error('This report name already exists');
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
          this.editNames["_results"][i].isReadOnly = true;
        },
        err => {
          Utils.hideSpinner();
          this.toasterService.error(err.message["error"]);
          this.editNames["_results"][i].isReadOnly = false;
        }
      );
    }
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
    this.getReportList();
  }

  public searchData(key) {
    let data = [];
    if (key) {
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
    this.dataSource = new MatTableDataSource(this.reportList);
    this.dataSource.paginator = this.paginator;
    if(this.sort){
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => 
    {
      if(typeof data[sortHeaderId] === 'string')
        return data[sortHeaderId].toLocaleLowerCase();

        return data[sortHeaderId];
    }
      this.sort.disableClear = true;
    }
  }
 
  public saveTags(data) {
    Utils.showSpinner();
    let tagsData = {
      report_list_id: this.id,
      tag_name: data.tag_name
    }
    this.semanticReportsService.saveTags(tagsData).subscribe(
      res => {
        this.getReportList();
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

  // edit option
  public editReport(report){

    
    const dialogRef = this.dialog.open(SelectSheetComponent, {
      width: '500px',
      height: '250px',
      data: {'sheetIds':report.sheet_ids,'sheetNames': report.sheet_names}
    })

    dialogRef.afterClosed().subscribe(result => {
      this.sharedDataService.setSaveAsDetails({'name':report.report_name,'desc':report.description,'isDqm':report.is_dqm});
      this.router.navigate(['semantic/sem-reports/create-report'], {queryParams: {report: report.report_id,sheet: result.sheetId}});
    })
    
  }

  public setScheduleElements(reportName,reportId){
    this.reportName = reportName;
    this.reportListIdToSchedule = reportId;
  }

  public goToReport(reportId:number){
    this.router.navigate(['semantic/sem-reports/view/insert', reportId]);
  }

  public cloneReport(event:any){
    
    let report = event.value ? event.value : {'report_name': '','report_id':'','created_by':'','user_id':'','sheet_ids':[]};

    this.sharedDataService.setSaveAsDetails({
      'name': `clone_${report.report_name}`,
      'desc': '',
      'isDqm': false
    });
    this.id = report.report_id;
    // this.createdBy = report.created_by;
    // this.userIds = report.user_id;
    this.selected_report_sheet = report.sheet_ids;
    if(report.report_name){
      $('#saveAsReportModal').modal('show');
    }
    
  }

  private getReqId() {
    return this.sharedDataService.getRequestId();
  }

  public isReqId(){
    return this.sharedDataService.getRequestId() === 0 ? false : true;
    // return this.sharedDataService.getRequestIdStatus();
  }

  checkErr() {
      this.router.config.forEach(element => {
        if (element.path == "semantic") {
          if(element.data["semantic_id"]){
            this.errData = false;
            this.getIds();
            this.getReportList();
          }else{
            this.errData = true;
          }
        }
      });
  }

  public saveReport(data:any){
    Utils.showSpinner();
    let options = {
      case_id : 1,
      sl_id : this.semanticId,
      copy_from: [{ report_id : this.id ,sheet_ids : this.selected_report_sheet }],
      report_name : data.name,
      is_dqm : this.isDqmValue
    }
    data.desc.trim() != ''?options['description'] = data.desc :''; 
    this.isReqId()?options['request_id'] = this.getReqId():''; //when this has request id(dqm false)

    this.semanticReportsService.cloneReport(options).subscribe(
      res => {
        this.toasterService.success(res['message']);
        this.getReportList();
        Utils.hideSpinner();
        Utils.closeModals();
        this.sharedDataService.setRequestId(0);
      },
      err =>{
        this.toasterService.error(err['message']);
        Utils.hideSpinner();
      }
    )
  }

  // TO DO : check origin
  public setReportId(id){
    this.reportListIdToSchedule = id;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));  
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  setDqmValue(value) {
    setTimeout(() => {
      this.sharedDataService.setSaveAsDetails({'isDqm':value});
    },2000);
  }

  sortData(event) {
    this.paginator.pageIndex = 0;
  }
  
  openDropdown(event,i) {
    let ele = document.getElementById('dropdown-fixed-'+i);

    ele.style.position = 'fixed';
    ele.style.top = event.clientY + 5+ 'px';
    ele.style.left = event.clientX - 60 + 'px';
    
    $('.dropdown-toggle').dropdown();
  }

  onScroll(event) {
    $('[data-toggle="dropdown"]').parent().removeClass('open');
  }
}
