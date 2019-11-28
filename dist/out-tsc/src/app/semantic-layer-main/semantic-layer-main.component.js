import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as $ from "jquery";
import { SemanticReportsService } from "../semantic-reports/semantic-reports.service";
import { AuthenticationService } from '../authentication.service';
import { SharedDataService } from "../create-report/shared-data.service";
var SemanticLayerMainComponent = /** @class */ (function () {
    function SemanticLayerMainComponent(activatedRoute, semanticReportsService, authenticationService, router, sharedDataService) {
        var _this = this;
        this.activatedRoute = activatedRoute;
        this.semanticReportsService = semanticReportsService;
        this.authenticationService = authenticationService;
        this.router = router;
        this.sharedDataService = sharedDataService;
        this.isReportsActive = false;
        this.isDqm = false;
        this.routeValue = false;
        this.isButton = false;
        this.authenticationService.myMethod$.subscribe(function (role) {
            if (role) {
                _this.userRole = role["role"];
            }
        });
    }
    SemanticLayerMainComponent.prototype.ngOnInit = function () {
        var _this = this;
        $(document).ready(function () {
            $("#sidebarCollapse").on("click", function () {
                $("#sidebar").toggleClass("active");
            });
        });
        this.authenticationService.button$.subscribe(function (isButton) { return _this.isButton = isButton; });
    };
    SemanticLayerMainComponent.prototype.showReportsNav = function () {
        if (this.activatedRoute.snapshot['firstChild']) {
            this.isReportsActive = (this.activatedRoute.snapshot['firstChild']['url'][0]['path'] === 'sem-reports') ? true : false;
        }
    };
    SemanticLayerMainComponent.prototype.checkRoute = function () {
        this.routeValue = false;
        this.authenticationService.setSlRoute(this.routeValue);
    };
    SemanticLayerMainComponent.prototype.setDqm = function (value) {
        this.semanticReportsService.isDqm = value;
        this.sharedDataService.setObjectExplorerPathValue(true); // resetting the 'Select Request Id' button
    };
    SemanticLayerMainComponent = tslib_1.__decorate([
        Component({
            selector: "app-semantic-layer-main",
            templateUrl: "./semantic-layer-main.component.html",
            styleUrls: ["./semantic-layer-main.component.css"]
        }),
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
            SemanticReportsService,
            AuthenticationService,
            Router,
            SharedDataService])
    ], SemanticLayerMainComponent);
    return SemanticLayerMainComponent;
}());
export { SemanticLayerMainComponent };
//# sourceMappingURL=semantic-layer-main.component.js.map