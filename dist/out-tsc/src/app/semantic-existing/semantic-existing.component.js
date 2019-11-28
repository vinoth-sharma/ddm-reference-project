import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate.min.js";
import { AuthenticationService } from "../authentication.service";
import { SemanticNewService } from "../semantic-new/semantic-new.service";
import { Router } from "@angular/router";
var SemanticExistingComponent = /** @class */ (function () {
    function SemanticExistingComponent(user, route, semanticNewService) {
        var _this = this;
        this.user = user;
        this.route = route;
        this.semanticNewService = semanticNewService;
        this.semanticLayers = [];
        // insert data to each cell
        this.addDetails = function (col, type) {
            var _this = this;
            col.value(function (cell, ri, ci, range) { return _this.getData(ri, type); });
        };
        this.getData = function (ri, type) {
            return type === "A"
                ? this.semanticLayers[ri].sl_name
                : this.semanticLayers[ri].mapped_tables.toString();
        };
        this.getWidth = function (wb, type) {
            var maxWidth = wb.range(type == "A"
                ? "A1:A" + this.semanticLayers.length
                : "B1:B" + this.semanticLayers.length)
                .reduce(function (max, cell) {
                var value = cell.value();
                if (value === undefined)
                    return max;
                return Math.max(max, value.toString().length);
            }, 0);
            return maxWidth;
        };
        this.user.Method$.subscribe(function (userid) { return (_this.userId = userid); });
        this.user.myMethod$.subscribe(function (role) {
            if (role) {
                _this.userRole = role["role"];
            }
        });
        this.semanticNewService.dataMethod$.subscribe(function (semanticLayers) {
            _this.semanticList = semanticLayers;
            _this.semanticLayers = _this.semanticList;
            _this.route.config.forEach(function (element) {
                if (element.path == "semantic") {
                    _this.semanticId = element.data["semantic_id"];
                }
            });
            _this.sorted = _this.semanticLayers;
            _this.sorted.forEach(function (ele) {
                _this.semanticLayers.forEach(function (element) {
                    if (element.sl_id == _this.semanticId) {
                        element['flagged'] = true;
                    }
                    else {
                        element['flagged'] = false;
                    }
                });
            });
            _this.sorted.sort(function (a, b) {
                if (b['flagged'] == a['flagged']) {
                    a = a.sl_name.toLowerCase();
                    b = b.sl_name.toLowerCase();
                    return (a < b) ? -1 : (a > b) ? 1 : 0;
                }
                return b['flagged'] > a['flagged'] ? 1 : -1;
            });
        });
    }
    SemanticExistingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.config.forEach(function (element) {
            if (element.path == "semantic") {
                _this.semanticId = element.data["semantic_id"];
            }
        });
        this.checkSl();
    };
    SemanticExistingComponent.prototype.checkSl = function () {
        if (!this.semanticLayers.length) {
            this.value = false;
        }
        else {
            this.value = true;
        }
    };
    SemanticExistingComponent.prototype.print = function () {
        var _this = this;
        var semanticLayerList = this.semanticLayers;
        var EXCEL_EXTENSION = ".xlsx";
        XlsxPopulate.fromBlankAsync()
            .then(function (workbook) {
            // const wb = workbook.addSheet("Semantic_Layer", 0);
            var wb = workbook.addSheet("Semantic_Layer", 1);
            workbook.activeSheet('Semantic_Layer');
            // Adding table name
            wb.cell("A1").value("Semantic Layer");
            wb.cell("B1").value("Tables");
            //style to first row
            wb.row(1).style({ bold: true, fill: "004e63" });
            _this.semanticLayers.forEach(function (element, key) {
                wb.row(key).height(30);
            });
            var colA = wb.range("A2:A" + _this.semanticLayers.length);
            var colB = wb.range("B2:B" + _this.semanticLayers.length);
            _this.addDetails(colA, "A");
            _this.addDetails(colB, "B");
            wb.column("A").width(_this.getWidth(wb, "A"));
            wb.column("B").width(_this.getWidth(wb, "B"));
            workbook.outputAsync().then(function (blob) {
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    // If IE, you must uses a different method.
                    window.navigator.msSaveOrOpenBlob(blob, "semantic-layers-" + new Date().getTime() + EXCEL_EXTENSION);
                }
                else {
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    a.download =
                        "semantic-layers-" + new Date().getTime() + EXCEL_EXTENSION;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }
            });
        })
            .catch(function (err) { return console.error(err); });
    };
    SemanticExistingComponent = tslib_1.__decorate([
        Component({
            selector: "app-semantic-existing",
            templateUrl: "./semantic-existing.component.html",
            styleUrls: ["./semantic-existing.component.css"]
        }),
        tslib_1.__metadata("design:paramtypes", [AuthenticationService,
            Router,
            SemanticNewService])
    ], SemanticExistingComponent);
    return SemanticExistingComponent;
}());
export { SemanticExistingComponent };
//# sourceMappingURL=semantic-existing.component.js.map