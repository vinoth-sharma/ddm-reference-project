import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { SecurityModalService } from '../security-modal/security-modal.service';
import Utils from "../../utils";
var SortTableComponent = /** @class */ (function () {
    function SortTableComponent(user, semanticModalService, toasterService, router) {
        this.user = user;
        this.semanticModalService = semanticModalService;
        this.toasterService = toasterService;
        this.router = router;
        this.allUserList = [];
        this.allSemanticList = [];
        this.displayedColumns = ['name', 'user_id', 'role', 'semantic_layers', 'privilages'];
        this.show = false;
        this.buttonName = '▼';
        this.reverse = false;
        this.defaultError = "There seems to be an error. Please try again later.";
    }
    SortTableComponent.prototype.ngOnInit = function () {
        this.tableSorting();
        this.isEmptyTables = false;
        Utils.showSpinner();
    };
    SortTableComponent.prototype.tableSorting = function () {
        var _this = this;
        this.user.getUser().subscribe(function (res) {
            Utils.showSpinner();
            _this.rarList = res;
            _this.dataSource = _this.rarList['data'];
            // //console.log("SORTING DATA IS:",this.dataSource)
            if (typeof (_this.dataSource) == 'undefined' || _this.dataSource.length == 0) {
                // display error message 
                _this.isEmptyTables = true;
            }
            _this.dataSource = new MatTableDataSource(_this.dataSource);
            _this.dataSource.paginator = _this.paginator;
            _this.dataSource.sort = _this.sort;
            _this.dataSource.sortingDataAccessor = function (data, sortHeaderId) {
                if (typeof data[sortHeaderId] === 'string')
                    return data[sortHeaderId].toLocaleLowerCase();
                return data[sortHeaderId];
            };
            Utils.hideSpinner();
        }, function (error) {
            _this.toasterService.error(_this.defaultError);
            Utils.hideSpinner();
        });
    };
    ;
    /**
     * getSecurityDetails
     */
    SortTableComponent.prototype.getSecurityDetails = function () {
        var _this = this;
        this.semanticModalService.getAllUserandSemanticList().subscribe(function (res) {
            _this.allUserList = res['data']["users list"];
            _this.allSemanticList = res['data']["semantic_layers"];
        }, function (err) {
            _this.allUserList = [];
            _this.allSemanticList = [];
        });
    };
    SortTableComponent.prototype.routeBack = function () {
        this.router.navigate(['semantic/sem-sl/sem-existing']);
    };
    SortTableComponent.prototype.refreshRoles = function () {
        this.tableSorting();
    };
    tslib_1.__decorate([
        ViewChild(MatSort),
        tslib_1.__metadata("design:type", MatSort)
    ], SortTableComponent.prototype, "sort", void 0);
    tslib_1.__decorate([
        ViewChild(MatPaginator),
        tslib_1.__metadata("design:type", MatPaginator)
    ], SortTableComponent.prototype, "paginator", void 0);
    SortTableComponent = tslib_1.__decorate([
        Component({
            selector: 'app-sort-table',
            templateUrl: './sort-table.component.html',
            styleUrls: ['./sort-table.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [AuthenticationService,
            SecurityModalService,
            ToastrService,
            Router])
    ], SortTableComponent);
    return SortTableComponent;
}());
export { SortTableComponent };
//# sourceMappingURL=sort-table.component.js.map