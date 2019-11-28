import * as tslib_1 from "tslib";
import { Component, ViewChildren, ViewChild } from "@angular/core";
import { SemanticReportsService } from "./semantic-reports.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import Utils from "../../utils";
import { QueryList } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { SharedDataService } from "../create-report/shared-data.service";
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ObjectExplorerSidebarService } from '../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { SelectSheetComponent } from '../create-report/select-sheet/select-sheet.component';
import { DjangoService } from '../../app/rmp/django.service';
var SemanticReportsComponent = /** @class */ (function () {
    function SemanticReportsComponent(sharedDataService, toasterService, user, semanticReportsService, router, objectExplorerSidebarService, dialog, djangoService) {
        this.sharedDataService = sharedDataService;
        this.toasterService = toasterService;
        this.user = user;
        this.semanticReportsService = semanticReportsService;
        this.router = router;
        this.objectExplorerSidebarService = objectExplorerSidebarService;
        this.dialog = dialog;
        this.djangoService = djangoService;
        this.reportList = [];
        this.selected_report_sheet = [];
        this.confirmHeader = '';
        this.noData = false;
        this.allReportList = [];
        this.description = '';
        this.searchType = 'By Name';
        this.isDqmValue = false;
        this.displayedColumn = [];
        this.sheet_names = [];
        this.sheet_ids = [];
        this.selection = new SelectionModel(true, []);
        this.requestIdsLoading = false;
        this.firstState = false;
        this.showSelectReqIdBtnState = false;
        this.notificationChoice = [
            { 'value': 'true', 'display': 'Yes' },
            { 'value': 'false', 'display': 'No' },
        ];
    }
    SemanticReportsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getIds();
        this.requestIdsLoading = true;
        // console.log("this.requestIdsLoading value in ngOnInit() ",this.requestIdsLoading);
        // console.log("this.selectedReqId value in ngOnInit() BEFORE SETTING ",this.selectedReqId);
        console.log("SHOWING SET REQUEST ID VALUE BEFORE :", this.sharedDataService.getRequestId());
        this.procuredRequestId = this.sharedDataService.getRequestId();
        this.showSelectReqIdBtnState = this.sharedDataService.getObjectExplorerPathValue();
        if (this.showSelectReqIdBtnState || this.procuredRequestId == 0 || this.procuredRequestId == undefined) {
            this.selectedReqId = 'Select Request Id';
            this.firstState = !this.firstState;
            this.sharedDataService.setRequestId(undefined);
            this.showSelectReqIdBtnState = true;
        }
        else if (this.procuredRequestId != 0 || this.procuredRequestId != undefined) { //||  ( typeof(this.procuredRequestId) == "number" )
            this.selectedReqId = this.procuredRequestId;
        }
        console.log("SHOWING SET REQUEST ID VALUE AFTER :", this.sharedDataService.getRequestId());
        this.procuredRequestId = this.sharedDataService.getRequestId();
        // console.log("this.selectedReqId value in ngOnInit() ",this.selectedReqId);
        this.objectExplorerSidebarService.$refreshState.subscribe(function (val) {
            if (val === 'reportList') {
                _this.getReportList();
                // console.log("ALL REPORTS WITH SL",val);
            }
        });
        this.objectExplorerSidebarService.getName.subscribe(function (semanticName) {
            _this.checkErr();
        });
        /// call django's list of reports
        var obj = {
            page_no: 1,
            per_page: 200,
            sort_by: ""
        };
        this.djangoService.list_of_reports(obj).subscribe(function (res) {
            if (res && _this.userId) {
                _this.user.fun(_this.userId).subscribe(function (userInfo) {
                    if (userInfo) {
                        // console.log("List of the reports",res);
                        // console.log("userInfo obtained!!!",userInfo);
                        var tempResults = res['report_list'];
                        _this.requestIds = [];
                        var assignedTo_1 = userInfo['user']['first_name'] + ' ' + userInfo['user']['last_name'];
                        // console.log("Assigned to owner : ",assignedTo)
                        tempResults.map(function (i) {
                            if (i.assigned_to == assignedTo_1 && i.status == "Active") {
                                // "Active"
                                _this.requestIds.push(i.ddm_rmp_post_report_id);
                                // this.requestIdsLoading = false;
                                // console.log("added data",i.ddm_rmp_post_report_id)
                            }
                            _this.requestIdsLoading = false;
                            // console.log("this.requestIdsLoading value in ngOnInit() ",this.requestIdsLoading);
                        });
                    }
                });
            }
        });
    };
    SemanticReportsComponent.prototype.setRequestId = function (selectedReqId) {
        // console.log("Selcetd request id : ",selectedReqId);
        if (selectedReqId == '-1' || selectedReqId == 'Free Report' || selectedReqId == 'Select Request Id') {
            // this.sharedDataService.setRequestId(selectedReqId);
            this.sharedDataService.setRequestId(null);
        }
        else {
            // this.sharedDataService.setRequestId(null);
            this.sharedDataService.setRequestId(selectedReqId);
        }
    };
    /**
     * get semantic id from router
     */
    SemanticReportsComponent.prototype.getIds = function () {
        var _this = this;
        this.user.errorMethod$.subscribe(function (id) { return _this.userId = id; });
        this.router.config.forEach(function (element) {
            if (element.path == "semantic") {
                _this.semanticId = element.data["semantic_id"];
            }
        });
    };
    /**
     * getReportList
     */
    SemanticReportsComponent.prototype.getReportList = function () {
        var _this = this;
        this.noData = false;
        this.isLoading = true;
        this.isDqmValue = this.semanticReportsService.isDqm;
        this.semanticReportsService
            .getReportList(this.semanticId, this.userId)
            .subscribe(function (res) {
            _this.isLoading = false;
            _this.reportList = res["data"]["report_list"].filter(function (element) {
                if (!element.is_dqm && !_this.isDqmValue) {
                    return element;
                }
                else if (element.is_dqm && _this.isDqmValue) {
                    return element;
                }
            });
            _this.modifyReport();
            _this.allReportList = res['data']['active_reports'];
            _this.sharedDataService.setReportList(_this.allReportList);
            // console.log("res",res);
        }, function (err) {
            _this.isLoading = false;
            _this.reportList = [];
            _this.dataSource = new MatTableDataSource(_this.reportList);
            _this.toasterService.error(err.message["error"]);
        });
    };
    // update reportList
    SemanticReportsComponent.prototype.modifyReport = function () {
        this.reportList = this.reportList.sort(function (a, b) {
            return (b.open_count - a.open_count);
        });
        this.reportListCopy = JSON.parse(JSON.stringify(this.reportList));
        this.reportList.forEach(function (element) {
            element.modified_on = new Date(element.modified_on);
            element.isEnabled = false;
        });
        if (!this.reportList.length)
            this.noData = true;
        this.displayedColumn = ["select", "report_name", "modified_on", "modified_by", "scheduled_by", "actions"];
        this.dataSource = new MatTableDataSource(this.reportList);
        this.dataSource.paginator = this.paginator;
        if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = function (data, sortHeaderId) {
                if (typeof data[sortHeaderId] === 'string')
                    return data[sortHeaderId].toLocaleLowerCase();
                return data[sortHeaderId];
            };
            this.sort.disableClear = true;
        }
    };
    SemanticReportsComponent.prototype.saveDescription = function (param) {
        var _this = this;
        Utils.showSpinner();
        var reportInfo;
        if (param.OriginalValue !== param.ChangedValue) {
            reportInfo = {
                "report_list_id": this.selectedId,
                "description": param.ChangedValue,
            };
            this.semanticReportsService.updateReport(reportInfo).subscribe(function (result) {
                _this.toasterService.success("Report description updated successfully");
                Utils.hideSpinner();
                Utils.closeModals();
                _this.reportList.forEach(function (ele) {
                    if (_this.selectedId == ele.report_id) {
                        ele.description = param.ChangedValue;
                    }
                });
            }, function (error) {
                _this.toasterService.error(error.message["error"]);
                Utils.hideSpinner();
            });
        }
        else {
            this.toasterService.error("Description is same");
            Utils.hideSpinner();
            Utils.closeModals();
        }
    };
    SemanticReportsComponent.prototype.deleteReport = function (report_id) {
        this.confirmText = "Are you sure you want to delete the report?";
        this.confirmHeader = "Delete report";
        report_id = Array.isArray(report_id) ? report_id : [report_id];
        var option = {
            report_list_id: report_id
        };
        this.confirmFn = function () {
            var _this = this;
            Utils.showSpinner();
            this.semanticReportsService.deleteReportList(option).subscribe(function (res) {
                _this.toasterService.success(res["message"]);
                _this.getReportList();
                Utils.hideSpinner();
                Utils.closeModals();
            }, function (err) {
                _this.toasterService.error(err.message["error"] || _this.defaultError);
                Utils.hideSpinner();
                Utils.closeModals();
            });
        };
    };
    /**
     * getSelectedReports
     */
    SemanticReportsComponent.prototype.getSelectedReports = function () {
        var checkedReport = [];
        // this.reportList.forEach(element => {
        //   if (element.checked) 
        //     checkedReport.push(element.report_id);
        // });
        this.selection.selected.forEach(function (element) {
            checkedReport.push(element.report_id);
        });
        this.deleteReport(checkedReport);
    };
    /**
     * enableRename
     */
    SemanticReportsComponent.prototype.enableRename = function (report, i) {
        this.reportList.forEach(function (element) {
            if (report.report_id === element.report_id) {
                element.isEnabled = true;
            }
            else
                element.isEnabled = false;
        });
        this.editNames["_results"][i].onDblClick();
        var inputFocus;
        setTimeout(function () {
            inputFocus = document.getElementById("rename-" + i);
            inputFocus['firstChild'].style.display = 'block';
            inputFocus['firstChild'].focus();
        });
    };
    /**
     * renameReport
     */
    SemanticReportsComponent.prototype.renameReport = function (val, i) {
        var _this = this;
        if (val.table_name.trim() === val.old_val.trim()) {
            this.toasterService.error('Please enter a new name');
            return;
        }
        else {
            if (this.checkDuplicate(val.table_name.trim()))
                this.toasterService.error('This report name already exists');
            else {
                var option = {
                    report_list_id: val.table_id,
                    report_name: val.table_name
                };
                Utils.showSpinner();
                this.semanticReportsService.renameReport(option).subscribe(function (res) {
                    _this.toasterService.success(res["message"]);
                    Utils.hideSpinner();
                    _this.reportList.forEach(function (element) {
                        if (element.isEnabled) {
                            element.report_name = val.table_name;
                        }
                        element.isEnabled = false;
                    });
                    _this.editNames["_results"][i].isReadOnly = true;
                }, function (err) {
                    Utils.hideSpinner();
                    _this.toasterService.error(err.message["error"]);
                    _this.editNames["_results"][i].isReadOnly = false;
                });
            }
        }
    };
    SemanticReportsComponent.prototype.checkDuplicate = function (name) {
        return this.allReportList.includes(name);
    };
    SemanticReportsComponent.prototype.setSearchValue = function (value) {
        this.searchType = value;
        this.reportList = JSON.parse(JSON.stringify(this.reportListCopy));
        document.getElementById("searchText")['value'] = '';
        this.noData = false;
        this.getReportList();
    };
    SemanticReportsComponent.prototype.searchData = function (key) {
        var _this = this;
        var data = [];
        if (key) {
            if (this.searchType == 'By Tag') {
                this.reportListCopy.filter(function (element) {
                    if (element.tags.length) {
                        var result = element.tags.find(function (ele) {
                            if (ele) {
                                return ele.toString().toLowerCase().match(key.toString().toLowerCase());
                            }
                        });
                        if (result) {
                            _this.noData = false;
                            data.push(element);
                        }
                        else {
                            if (!data.length) {
                                _this.noData = true;
                            }
                        }
                    }
                });
            }
            else {
                this.reportListCopy.forEach(function (ele) {
                    ele.modified_on = new Date(ele.modified_on).toString();
                });
                this.reportListCopy.filter(function (element) {
                    if ((element.report_name && element.report_name.toLowerCase().match(key.toLowerCase())) ||
                        (element.modified_by && element.modified_by.toLowerCase().match(key.toLowerCase())) ||
                        (element.modified_on && element.modified_on.toLowerCase().match(key.toLowerCase())) ||
                        (element.scheduled_by && element.scheduled_by.toLowerCase().match(key).toLowerCase())) {
                        _this.noData = false;
                        data.push(element);
                    }
                });
            }
        }
        else {
            data = JSON.parse(JSON.stringify(this.reportListCopy));
            this.noData = false;
        }
        if (!data.length) {
            this.noData = true;
        }
        this.reportList = data;
        this.dataSource = new MatTableDataSource(this.reportList);
        this.dataSource.paginator = this.paginator;
        if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = function (data, sortHeaderId) {
                if (typeof data[sortHeaderId] === 'string')
                    return data[sortHeaderId].toLocaleLowerCase();
                return data[sortHeaderId];
            };
            this.sort.disableClear = true;
        }
    };
    SemanticReportsComponent.prototype.saveTags = function (data) {
        var _this = this;
        Utils.showSpinner();
        var tagsData = {
            report_list_id: this.id,
            tag_name: data.tag_name
        };
        this.semanticReportsService.saveTags(tagsData).subscribe(function (res) {
            _this.getReportList();
            _this.toasterService.success(res['message']);
            Utils.hideSpinner();
        }, function (err) {
            _this.toasterService.error(err.message["error"]);
            Utils.hideSpinner();
        });
    };
    /**
     * storeFrequency
     */
    SemanticReportsComponent.prototype.storeFrequency = function (element) {
        var _this = this;
        var data = {
            "report_frequency_id": element.report_frequency_id
        };
        Utils.showSpinner();
        this.semanticReportsService.storeFrequencyCount(data).subscribe(function (res) {
            Utils.hideSpinner();
            _this.goToReport(element.report_id);
            _this.toasterService.success(res['message']);
        }, function (err) {
            Utils.hideSpinner();
            _this.goToReport(element.report_id);
            _this.toasterService.error(err.message["error"]);
        });
    };
    // edit option
    SemanticReportsComponent.prototype.editReport = function (report) {
        var _this = this;
        var dialogRef = this.dialog.open(SelectSheetComponent, {
            width: '500px',
            height: '250px',
            data: { 'sheetIds': report.sheet_ids, 'sheetNames': report.sheet_names }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.sharedDataService.setSaveAsDetails({ 'name': report.report_name, 'desc': report.description, 'isDqm': report.is_dqm });
            _this.router.navigate(['semantic/sem-reports/create-report'], { queryParams: { report: report.report_id, sheet: result.sheetId } });
        });
    };
    SemanticReportsComponent.prototype.setScheduleElements = function (reportName, reportId) {
        if (this.reportName == reportName || this.reportListIdToSchedule == reportId) {
            this.scheduleChanges++;
        }
        else {
            this.scheduleChanges = 0;
        }
        this.reportName = reportName;
        this.reportListIdToSchedule = reportId;
    };
    SemanticReportsComponent.prototype.goToReport = function (reportId) {
        this.router.navigate(['semantic/sem-reports/view/insert', reportId]);
    };
    SemanticReportsComponent.prototype.cloneReport = function (event) {
        var report = event.value ? event.value : { 'report_name': '', 'report_id': '', 'created_by': '', 'user_id': '', 'sheet_ids': [] };
        this.sharedDataService.setSaveAsDetails({
            'name': "clone_" + report.report_name,
            'desc': '',
            'isDqm': false
        });
        this.id = report.report_id;
        // this.createdBy = report.created_by;
        // this.userIds = report.user_id;
        this.selected_report_sheet = report.sheet_ids;
        if (report.report_name) {
            $('#saveAsReportModal').modal('show');
        }
    };
    SemanticReportsComponent.prototype.getReqId = function () {
        return this.sharedDataService.getRequestId();
    };
    SemanticReportsComponent.prototype.isReqId = function () {
        // if(this.sharedDataService.getRequestId() ===)
        return this.sharedDataService.getRequestId() === (0 || undefined) ? false : true;
        // return this.sharedDataService.getRequestIdStatus();
    };
    SemanticReportsComponent.prototype.checkErr = function () {
        var _this = this;
        this.router.config.forEach(function (element) {
            if (element.path == "semantic") {
                if (element.data["semantic_id"]) {
                    _this.errData = false;
                    _this.getIds();
                    _this.getReportList();
                }
                else {
                    _this.errData = true;
                }
            }
        });
    };
    SemanticReportsComponent.prototype.saveReport = function (data) {
        var _this = this;
        Utils.showSpinner();
        var options = {
            case_id: 1,
            sl_id: this.semanticId,
            copy_from: [{ report_id: this.id, sheet_ids: this.selected_report_sheet }],
            report_name: data.name,
            is_dqm: this.isDqmValue
        };
        data.desc.trim() != '' ? options['description'] = data.desc : '';
        // this.isReqId()?options['request_id'] = this.getReqId():''; //when this has request id(dqm false)
        this.semanticReportsService.cloneReport(options).subscribe(function (res) {
            _this.toasterService.success(res['message']);
            _this.getReportList();
            Utils.hideSpinner();
            Utils.closeModals();
            _this.sharedDataService.setRequestId(0);
        }, function (err) {
            _this.toasterService.error(err['message']);
            Utils.hideSpinner();
        });
    };
    // TO DO : check origin
    SemanticReportsComponent.prototype.setReportId = function (id) {
        this.reportListIdToSchedule = id;
    };
    SemanticReportsComponent.prototype.isAllSelected = function () {
        var numSelected = this.selection.selected.length;
        var numRows = this.dataSource.data.length;
        return numSelected === numRows;
    };
    SemanticReportsComponent.prototype.masterToggle = function () {
        var _this = this;
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(function (row) { return _this.selection.select(row); });
    };
    SemanticReportsComponent.prototype.checkboxLabel = function (row) {
        if (!row) {
            return (this.isAllSelected() ? 'select' : 'deselect') + " all";
        }
        return (this.selection.isSelected(row) ? 'deselect' : 'select') + " row " + (row.position + 1);
    };
    SemanticReportsComponent.prototype.setDqmValue = function (value) {
        var _this = this;
        setTimeout(function () {
            _this.sharedDataService.setSaveAsDetails({ 'isDqm': value });
        }, 2000);
        // resetting the create report request-id
        this.sharedDataService.setObjectExplorerPathValue(true);
    };
    SemanticReportsComponent.prototype.sortData = function (event) {
        this.paginator.pageIndex = 0;
    };
    SemanticReportsComponent.prototype.openDropdown = function (event, i) {
        var ele = document.getElementById('dropdown-fixed-' + i);
        ele.style.position = 'fixed';
        ele.style.top = event.clientY + 5 + 'px';
        ele.style.left = event.clientX - 60 + 'px';
        $('.dropdown-toggle').dropdown();
    };
    SemanticReportsComponent.prototype.onScroll = function (event) {
        $('[data-toggle="dropdown"]').parent().removeClass('open');
    };
    tslib_1.__decorate([
        ViewChild(MatPaginator),
        tslib_1.__metadata("design:type", MatPaginator)
    ], SemanticReportsComponent.prototype, "paginator", void 0);
    tslib_1.__decorate([
        ViewChild(MatSort),
        tslib_1.__metadata("design:type", MatSort)
    ], SemanticReportsComponent.prototype, "sort", void 0);
    tslib_1.__decorate([
        ViewChildren("editName"),
        tslib_1.__metadata("design:type", QueryList)
    ], SemanticReportsComponent.prototype, "editNames", void 0);
    SemanticReportsComponent = tslib_1.__decorate([
        Component({
            selector: "app-semantic-reports",
            templateUrl: "./semantic-reports.component.html",
            styleUrls: ["./semantic-reports.component.css"]
        }),
        tslib_1.__metadata("design:paramtypes", [SharedDataService,
            ToastrService,
            AuthenticationService,
            SemanticReportsService,
            Router,
            ObjectExplorerSidebarService,
            MatDialog,
            DjangoService])
    ], SemanticReportsComponent);
    return SemanticReportsComponent;
}());
export { SemanticReportsComponent };
//# sourceMappingURL=semantic-reports.component.js.map