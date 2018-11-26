var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { UserService } from '../user.service';
var SortTableComponent = /** @class */ (function () {
    function SortTableComponent(userService) {
        this.userService = userService;
        this.displayedColumns = ['name', 'username', 'email'];
    }
    SortTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getUser().subscribe(function (results) {
            if (!results) {
                return;
            }
            _this.dataSource = new MatTableDataSource(results);
            _this.dataSource.sort = _this.sort;
        });
    };
    __decorate([
        ViewChild(MatSort),
        __metadata("design:type", MatSort)
    ], SortTableComponent.prototype, "sort", void 0);
    SortTableComponent = __decorate([
        Component({
            selector: 'app-sort-table',
            templateUrl: './sort-table.component.html',
            styleUrls: ['./sort-table.component.css']
        }),
        __metadata("design:paramtypes", [UserService])
    ], SortTableComponent);
    return SortTableComponent;
}());
export { SortTableComponent };
//# sourceMappingURL=sort-table.component.js.map