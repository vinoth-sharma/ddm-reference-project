var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
var LandingPageComponent = /** @class */ (function () {
    function LandingPageComponent(route, user) {
        var _this = this;
        this.route = route;
        this.user = user;
        this.isbuttonVisible = false;
        this.user.myMethod$.subscribe(function (arr) {
            return _this.arr = arr;
        });
        this.roles = this.arr.user;
        this.roleName = this.arr.role_check;
    }
    LandingPageComponent.prototype.role = function () {
        console.log('success');
        this.route.navigate(['module']);
    };
    // role_console() {
    //   console.log('success');
    //   this.route.navigate(['module'])
    // }
    LandingPageComponent.prototype.ngOnInit = function () {
    };
    LandingPageComponent = __decorate([
        Component({
            selector: 'app-landing-page',
            templateUrl: './landing-page.component.html',
            styleUrls: ['./landing-page.component.css']
        }),
        __metadata("design:paramtypes", [Router, AuthenticationService])
    ], LandingPageComponent);
    return LandingPageComponent;
}());
export { LandingPageComponent };
//# sourceMappingURL=landing-page.component.js.map