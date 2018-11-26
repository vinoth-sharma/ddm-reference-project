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
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
var LoginComponent = /** @class */ (function () {
    function LoginComponent(http, toastr, user, router) {
        this.http = http;
        this.toastr = toastr;
        this.user = user;
        this.router = router;
        this.users = [];
        this.userIdentification = {};
        this.messageSource = new BehaviorSubject('default message');
        this.currentMessage = this.messageSource.asObservable();
        this.users = this.user.userData;
        this.successMsg = false;
        console.log(this.users);
    }
    LoginComponent.prototype.getUserInformation = function () {
        var _this = this;
        // console.log(this._url);
        this.user.fun(this.userid).subscribe(function (res) {
            _this.arr = res;
            console.log(_this.arr);
            _this.semdet = res["sls"];
            _this.roleName = res["role_check"];
            _this.roles = res["user"];
            console.log(_this.roles);
            console.log(_this.semdet);
            _this.router.navigate(['user']);
            _this.user.myMethod(_this.arr);
            console.log(_this.roles);
            console.log(_this.roleName);
        }, function (error) { console.log("FAILURE"); });
    };
    ;
    LoginComponent.prototype.loginUser = function () {
        var _this = this;
        this.userid = this.username;
        this.loading = true;
        console.log(this.userid);
        event.preventDefault();
        if (this.users.find(function (us) { return (us.username == _this.username && us.password == _this.password); })) {
            console.log('success');
            this.user.SetUserDetails();
            this.getUserInformation();
            this.loading = true;
            this.toastr.success('Logged in successfully');
        }
        else {
            console.log('failure');
            this.toastr.error('Login failed');
            this.loading = false;
        }
    };
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent = __decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        }),
        __metadata("design:paramtypes", [Http, ToastrService, AuthenticationService, Router])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map