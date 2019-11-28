import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { AuthSsoService } from '../auth-sso.service';
import { ToastrService } from 'ngx-toastr';
import { DataProviderService } from "src/app/rmp/data-provider.service";
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(route, authenticationService, activatedRoute, authSsoService, toastrService, dataProvider) {
        var _this = this;
        this.route = route;
        this.authenticationService = authenticationService;
        this.activatedRoute = activatedRoute;
        this.authSsoService = authSsoService;
        this.toastrService = toastrService;
        this.dataProvider = dataProvider;
        this.isButtonVisible = true;
        this.show = false;
        this.buttonName = '▼';
        this.authenticationService.myMethod$.subscribe(function (arr) {
            _this.arr = arr;
            _this.roles = { 'first_name': _this.arr.first_name, 'last_name': _this.arr.last_name };
            _this.roleName = { 'role': _this.arr.role };
        });
        this.authenticationService.myMethod$.subscribe(function (role) {
            if (role) {
                _this.user_role = role["role"];
                _this.dataProvider.currentNotifications.subscribe(function (element) {
                    if (element) {
                        _this.user_name = role["first_name"] + "" + role["last_name"];
                        _this.user_role = role["role"];
                        //console.log("NOTIFICATION CALL")
                        _this.notification_list = element.filter(function (element) {
                            return element.commentor != _this.user_name;
                        });
                        var setBuilder = [];
                        _this.notification_list.map(function (element) {
                            setBuilder.push(element.ddm_rmp_post_report);
                        });
                        //console.log(this.notification_list)  
                        _this.notification_set = new Set(setBuilder);
                        //console.log(this.notification_set)
                        _this.notification_number = _this.notification_set.size;
                    }
                });
            }
        });
    }
    HeaderComponent.prototype.ngOnInit = function () { };
    HeaderComponent.prototype.callRolespage = function () {
        this.route.navigate(['roles']);
    };
    HeaderComponent.prototype.callLogEntryView = function () {
        this.route.navigate(['logs']);
    };
    HeaderComponent.prototype.role = function () {
        this.route.navigate(['user']);
    };
    HeaderComponent.prototype.modulePageRoute = function () {
        this.route.navigate(['user']);
    };
    HeaderComponent.prototype.toggle = function () {
        this.show = !this.show;
        if (this.show)
            this.buttonName = "▲";
        else
            this.buttonName = "▼";
    };
    HeaderComponent.prototype.goToLogin = function () {
        var _this = this;
        // this.route.navigate(['login'])
        this.authenticationService.logout().subscribe(function (res) {
            _this.authSsoService.deleteToken();
            window.location.href = res['redirect_url'];
        }, function (error) {
            _this.toastrService.error(error);
        });
    };
    HeaderComponent = tslib_1.__decorate([
        Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.comp.css']
        }),
        tslib_1.__metadata("design:paramtypes", [Router,
            AuthenticationService,
            ActivatedRoute,
            AuthSsoService,
            ToastrService,
            DataProviderService])
    ], HeaderComponent);
    return HeaderComponent;
}());
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map