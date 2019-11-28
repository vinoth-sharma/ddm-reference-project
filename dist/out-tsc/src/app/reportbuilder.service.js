import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
var ReportbuilderService = /** @class */ (function () {
    function ReportbuilderService(http) {
        this.http = http;
    }
    ReportbuilderService.prototype.task = function () {
        return this.http.get('./assets/report.json');
    };
    ReportbuilderService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient])
    ], ReportbuilderService);
    return ReportbuilderService;
}());
export { ReportbuilderService };
//# sourceMappingURL=reportbuilder.service.js.map