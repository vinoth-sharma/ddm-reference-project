import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { environment } from "../environments/environment";
var SemdetailsService = /** @class */ (function () {
    function SemdetailsService(http) {
        this.http = http;
    }
    SemdetailsService.prototype.handleError = function (error) {
        var errObj = {
            status: error.status
        };
        throw errObj;
    };
    SemdetailsService.prototype.fetchsem = function (sls) {
        var serviceurl = environment.baseUrl + "semantic_layer/manage_tables/?sl_id=" + sls;
        return this.http.get(serviceurl)
            .pipe(catchError(this.handleError));
    };
    SemdetailsService.prototype.getviews = function (sls) {
        var serviceurl = environment.baseUrl + "semantic_layer/manage_views/?sl_id=" + sls;
        return this.http.get(serviceurl)
            .pipe(catchError(this.handleError));
    };
    SemdetailsService = tslib_1.__decorate([
        Injectable({
            providedIn: "root"
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient])
    ], SemdetailsService);
    return SemdetailsService;
}());
export { SemdetailsService };
//# sourceMappingURL=semdetails.service.js.map