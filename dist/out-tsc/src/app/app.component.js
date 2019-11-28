import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { DataProviderService } from "src/app/rmp/data-provider.service";
var AppComponent = /** @class */ (function () {
    function AppComponent(dataProvider) {
        var _this = this;
        this.dataProvider = dataProvider;
        this.title = "DDM";
        this.dataLoad = false;
        this.spinnerConfig = {
            bdColor: "rgba(51,51,51,0.8)",
            size: "default",
            color: "#fff",
            type: "line-spin-clockwise-fade"
        };
        this.associates = [
            {
                role: "Admin",
                firstname: "Jacquelin",
                lastname: "Beiter"
            },
            { role: "Non-Admin", firstname: "Aubrey", lastname: "Dubberke" },
            { role: "Report Viewer", firstname: "Charlie", lastname: "Chevoor" }
        ];
        this.dataProvider.currentIntialLoad.subscribe(function (element) {
            if (element) {
                _this.dataLoad = true;
            }
        });
    }
    AppComponent.prototype.recieveUserdetails = function ($event) {
        this.roleId = $event;
        //console.log(this.roleId);
    };
    AppComponent = tslib_1.__decorate([
        Component({
            selector: "app-root",
            templateUrl: "./app.component.html",
            styleUrls: ["./app.component.css"]
        }),
        tslib_1.__metadata("design:paramtypes", [DataProviderService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map