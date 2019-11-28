import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { AuthSsoService } from './auth-sso.service';
var AuthGuard = /** @class */ (function () {
    function AuthGuard(user, router, authSsoService) {
        this.user = user;
        this.router = router;
        this.authSsoService = authSsoService;
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        // this.user.getUserDetails()
        if (this.authSsoService.getTokenId()) {
            //console.log("User session is being logged") 
            return true;
        }
        else {
            // this.router.navigate(['']);
            // //console.log("Authentication failure")
            return false;
        }
    };
    AuthGuard = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AuthenticationService, Router, AuthSsoService])
    ], AuthGuard);
    return AuthGuard;
}());
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map