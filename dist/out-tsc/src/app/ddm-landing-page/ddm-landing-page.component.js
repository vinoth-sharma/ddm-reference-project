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
import { SemdetailsService } from '../semdetails.service';
var DdmLandingPageComponent = /** @class */ (function () {
    function DdmLandingPageComponent(route, user, se) {
        var _this = this;
        this.route = route;
        this.user = user;
        this.se = se;
        // semantic=[{name:'Vehicle Info'},{name:'Pricing Team'},{name:'Vehicle Allocation'}];
        this.isbutton = false;
        this.user.myMethod$.subscribe(function (arr) {
            return _this.arr = arr;
        });
        this.sem = this.arr.sls;
    }
    DdmLandingPageComponent.prototype.fun = function (event) {
        var _this = this;
        this.isbutton = true;
        this.sel = event.target.value;
        this.sls = this.sem.find(function (x) { return x.sl_name == _this.sel; }).sl_id;
        console.log(this.sel);
        console.log(this.sls);
        this.se.fetchsem(this.sls).subscribe(function (res) {
            _this.det = res;
            console.log(_this.det);
            _this.columns = res["sl_list"];
            console.log(_this.columns);
            _this.se.myMethod(_this.columns);
        });
    };
    ;
    DdmLandingPageComponent.prototype.choose = function () {
        this.route.navigate(['explorere']);
    };
    DdmLandingPageComponent.prototype.ngOnInit = function () {
    };
    DdmLandingPageComponent = __decorate([
        Component({
            selector: 'app-ddm-landing-page',
            templateUrl: './ddm-landing-page.component.html',
            styleUrls: ['./ddm-landing-page.component.css']
        }),
        __metadata("design:paramtypes", [Router, AuthenticationService, SemdetailsService])
    ], DdmLandingPageComponent);
    return DdmLandingPageComponent;
}());
export { DdmLandingPageComponent };
//# sourceMappingURL=ddm-landing-page.component.js.map