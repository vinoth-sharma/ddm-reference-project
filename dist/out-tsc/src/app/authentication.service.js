var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(http) {
        this.http = http;
        this.userData = [
            { username: 'USER1', lastname: 'biju', password: 1723, roleid: 'Viewers', rolename: 'Viewers' },
            { username: 'USER2', lastname: 'kumari', password: 1234, roleid: 'Non-admin', rolename: 'Non Administration' },
            { username: 'USER3', lastname: 'raut', password: 1236, roleid: 'Admin', rolename: 'Administration' },
            { username: 'USER4', lastname: 'd', password: 1273, roleid: 'Viewers', rolename: 'Viewers' },
            { username: 'USER5', lastname: 'gupta', password: 1223, roleid: 'Non-admin', rolename: 'Non Administration' }
        ];
        this.myMethodSubject = new BehaviorSubject("");
        this.isUserLoggedIn = false;
        this.myMethod$ = this.myMethodSubject.asObservable();
    }
    AuthenticationService.prototype.myMethod = function (userInformation) {
        console.log(userInformation);
        this.myMethodSubject.next(userInformation);
    };
    AuthenticationService.prototype.SetUserDetails = function () {
        this.isUserLoggedIn = true;
    };
    AuthenticationService.prototype.getUserDetails = function () {
        return this.isUserLoggedIn;
    };
    ;
    AuthenticationService.prototype.fun = function (userid) {
        var serviceUrl = "http://localhost:8000/login/?userid=" + userid;
        return this.http.get(serviceUrl);
        console.log(this.userid);
    };
    ;
    AuthenticationService.prototype.getTables = function (slid) {
        var serviceUrl = "http://localhost:8000/semantic_layer/tables/?sl_id=0";
        return this.http.get(serviceUrl);
        console.log(this.slid);
    };
    AuthenticationService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], AuthenticationService);
    return AuthenticationService;
}());
export { AuthenticationService };
//# sourceMappingURL=authentication.service.js.map