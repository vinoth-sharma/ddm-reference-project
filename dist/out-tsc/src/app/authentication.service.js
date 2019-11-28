import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from "../environments/environment";
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(http) {
        this.http = http;
        this.userData = [{ username: 'USER1', password: 1723 },
            { username: 'USER2', password: 1234 },
            { username: 'USER3', password: 1236 },
            { username: 'USER4', password: 1273 },
            { username: 'USER5', password: 1223 },
            { username: 'USER10', password: 1000 }
        ];
        this.userId = {};
        this.myMethodSubject = new BehaviorSubject("");
        this.isButtonSubject = new BehaviorSubject(this.isButton);
        this.slMethodSubject = new BehaviorSubject(this.userid);
        this.slNamesMethodSubject = new BehaviorSubject(this.slDetails);
        this.slRouteValueSubject = new BehaviorSubject(this.routeValue);
        this.errorMethodSubject = new BehaviorSubject("");
        this.isUserLoggedIn = false;
        this.myMethod$ = this.myMethodSubject.asObservable();
        this.Method$ = this.slMethodSubject.asObservable();
        this.button$ = this.isButtonSubject.asObservable();
        this.errorMethod$ = this.errorMethodSubject.asObservable();
        this.sl$ = this.slNamesMethodSubject.asObservable();
        this.slRoute$ = this.slRouteValueSubject.asObservable();
    }
    AuthenticationService.prototype.myMethod = function (userInformation, userid, schema) {
        this.myMethodSubject.next(userInformation);
        this.slMethodSubject.next(userid);
        this.setSchema(schema);
    };
    AuthenticationService.prototype.setSchema = function (schema) {
        this.schema = schema;
    };
    AuthenticationService.prototype.getSchema = function () {
        return this.schema;
    };
    AuthenticationService.prototype.setSlMethod = function (slDetails) {
        this.slNamesMethodSubject.next(slDetails);
    };
    AuthenticationService.prototype.setSlRoute = function (routeValue) {
        this.slRouteValueSubject.next(routeValue);
    };
    AuthenticationService.prototype.button = function (isButton) {
        this.isButtonSubject.next(isButton);
    };
    AuthenticationService.prototype.errorMethod = function (userInformation) {
        this.errorMethodSubject.next(userInformation);
    };
    AuthenticationService.prototype.SetUserDetails = function () {
        this.isUserLoggedIn = true;
    };
    AuthenticationService.prototype.getUserDetails = function () {
        return this.isUserLoggedIn;
    };
    ;
    AuthenticationService.prototype.fun = function (userid) {
        var serviceUrl = environment.baseUrl + "login/?userid=" + userid;
        return this.http.get(serviceUrl);
    };
    ;
    AuthenticationService.prototype.getTables = function (slid) {
        var serviceUrl = environment.baseUrl + "semantic_layer/tables/?sl_id=0";
        return this.http.get(serviceUrl);
    };
    AuthenticationService.prototype.getSldetails = function (userid) {
        var serviceUrl = environment.baseUrl + "semantic_layer/semantic_layers_details/?user_id=" + userid;
        return this.http.get(serviceUrl);
    };
    AuthenticationService.prototype.getUser = function () {
        var serviceUrl = environment.baseUrl + "roles_and_responsibilities/";
        return this.http.get(serviceUrl);
    };
    AuthenticationService.prototype.logout = function () {
        var serviceUrl = environment.baseUrl + "login/signout";
        return this.http.get(serviceUrl);
    };
    AuthenticationService.prototype.getCustomTablesDetails = function () {
        var serviceUrl = environment.baseUrl + "semantic_layer/get_custom_table_names";
        return this.http.get(serviceUrl);
    };
    AuthenticationService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient])
    ], AuthenticationService);
    return AuthenticationService;
}());
export { AuthenticationService };
//# sourceMappingURL=authentication.service.js.map