import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ListOfValuesService } from './list-of-values.service';
import { LovContainerComponent } from './lov-container/lov-container.component';
var ModallistComponent = /** @class */ (function () {
    function ModallistComponent(dialog, listOfValuesService) {
        this.dialog = dialog;
        this.listOfValuesService = listOfValuesService;
        this.items = [];
        this.dataType = '';
        this.load = false;
        this.createdLov = [];
    }
    ModallistComponent.prototype.ngOnInit = function () {
    };
    ModallistComponent.prototype.openLovDialog = function () {
        var dialogRef = this.dialog.open(LovContainerComponent, {
            width: '800px',
            height: 'auto',
            maxHeight: '450px',
            data: { values: this.items, tableSelectedId: this.tableSelectedId, columnName: this.columnName, count: this.count }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                console.log(result, 'result');
            }
        });
    };
    ModallistComponent.prototype.getLovList = function () {
        var _this = this;
        this.load = true;
        var options = {};
        options["tableId"] = this.tableSelectedId;
        options['columnName'] = this.columnName;
        this.listOfValuesService.getLov(options).subscribe(function (res) {
            _this.createdLov = res['data'];
            _this.load = false;
        });
    };
    ModallistComponent.prototype.ngOnChanges = function (changes) {
        if (typeof this.values != "undefined") {
            this.dataType = this.values['data_type'];
            this.count = this.values['data']['count'];
            this.items = this.values['data']['list'];
            this.columnName = Object.keys(this.items[0])[0];
        }
        if (this.tableSelectedId && this.columnName) {
            this.getLovList();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], ModallistComponent.prototype, "values", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], ModallistComponent.prototype, "Loading", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ModallistComponent.prototype, "tableSelectedId", void 0);
    ModallistComponent = tslib_1.__decorate([
        Component({
            selector: 'app-modallist',
            templateUrl: './modallist.component.html',
            styleUrls: ['./modallist.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [MatDialog,
            ListOfValuesService])
    ], ModallistComponent);
    return ModallistComponent;
}());
export { ModallistComponent };
//# sourceMappingURL=modallist.component.js.map