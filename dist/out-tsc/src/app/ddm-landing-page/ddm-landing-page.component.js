import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { SemdetailsService } from "../semdetails.service";
import { ObjectExplorerSidebarService } from "../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
import Utils from "../../utils";
var DdmLandingPageComponent = /** @class */ (function () {
    function DdmLandingPageComponent(route, activatedRoute, user, se, objectExplorerSidebarService) {
        var _this = this;
        this.route = route;
        this.activatedRoute = activatedRoute;
        this.user = user;
        this.se = se;
        this.objectExplorerSidebarService = objectExplorerSidebarService;
        this.isButton = false;
        this.isBlink = false;
        this.show = false;
        this.buttonName = '▼';
        this.user.myMethod$.subscribe(function (arr) { return _this.arr = arr; });
        this.roles = this.arr.user;
        this.roleName = this.arr.role_check;
    }
    DdmLandingPageComponent.prototype.blinking = function () {
        this.isBlink = !this.isBlink;
    };
    // fun(event: any) {
    //   this.isButton = true;
    //   this.sel = event.target.value;
    //   this.sls = this.semanticNames.find(x => 
    //     x.sl_name.trim().toLowerCase() == this.sel.trim().toLowerCase()
    //   ).sl_id;
    //   this.route.config.forEach(element => {
    //     if (element.path == "semantic") {
    //       element.data["semantic"] = this.sel;
    //       element.data["semantic_id"] = this.sls;
    //     }
    //   });
    //   this.activatedRoute.snapshot.data["semantic"] = this.sel;
    //   this.sele = this.sel;
    //   this.se.fetchsem(this.sls).subscribe(res => { 
    //     this.columns = res["data"]["sl_table"];
    //       this.objectExplorerSidebarService.setTables(this.columns);
    //   });
    //   this.se.getviews(this.sls).subscribe(res => {
    //     this.views = res["data"]["sl_view"];
    //     this.objectExplorerSidebarService.setCustomTables(this.views);
    //   });
    // };
    DdmLandingPageComponent.prototype.callSemanticlayer = function () {
        this.route.navigate(['semantic']);
    };
    DdmLandingPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.user.errorMethod$.subscribe(function (userid) {
            return _this.userid = userid;
        });
        Utils.showSpinner();
        // this.user.fun(this.userid).subscribe(res => {
        //   this.semanticNames = res["sls"];
        //   Utils.hideSpinner();
        // }
        // )
    };
    DdmLandingPageComponent.prototype.toggle = function () {
        this.show = !this.show;
        // CHANGE THE NAME OF THE BUTTON.
        if (this.show)
            this.buttonName = "▲";
        else
            this.buttonName = "▼";
    };
    DdmLandingPageComponent.prototype.callRMP = function () {
        this.route.navigate(['user']);
    };
    DdmLandingPageComponent = tslib_1.__decorate([
        Component({
            selector: "app-ddm-landing-page",
            templateUrl: "./ddm-landing-page.component.html",
            styleUrls: ["./ddm-landing-page.component.css"]
        }),
        tslib_1.__metadata("design:paramtypes", [Router,
            ActivatedRoute,
            AuthenticationService,
            SemdetailsService,
            ObjectExplorerSidebarService])
    ], DdmLandingPageComponent);
    return DdmLandingPageComponent;
}());
export { DdmLandingPageComponent };
//# sourceMappingURL=ddm-landing-page.component.js.map