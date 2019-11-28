import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
var RmpLandingPageComponent = /** @class */ (function () {
    function RmpLandingPageComponent(route, user) {
        var _this = this;
        this.route = route;
        this.user = user;
        this.isbuttonVisible = false;
        this.user.myMethod$.subscribe(function (arr) {
            _this.arr = arr;
            _this.roles = { 'first_name': _this.arr.first_name, 'last_name': _this.arr.last_name, 'role_id': _this.arr.role_id };
            _this.roleName = { 'role': _this.arr.role };
        });
        // this.arr = arr;
        // this.roles=this.arr.user;
        // this.roleName=this.arr.role_check;
    }
    RmpLandingPageComponent.prototype.role = function () {
        //console.log('success')
        this.route.navigate(['semantic']);
    };
    RmpLandingPageComponent.prototype.ngOnInit = function () {
    };
    RmpLandingPageComponent = tslib_1.__decorate([
        Component({
            selector: 'app-rmp-landing-page',
            templateUrl: './rmp-landing-page.component.html',
            styleUrls: ['./rmp-landing-page.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [Router, AuthenticationService])
    ], RmpLandingPageComponent);
    return RmpLandingPageComponent;
}());
export { RmpLandingPageComponent };
//# sourceMappingURL=rmp-landing-page.component.js.map