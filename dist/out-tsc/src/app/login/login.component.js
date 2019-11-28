import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
// import { DataProviderService } from "../rmp/data-provider.service";
import { NgxSpinnerService } from "ngx-spinner";
var LoginComponent = /** @class */ (function () {
    function LoginComponent(http, spinner, toastr, user, router) {
        this.http = http;
        this.spinner = spinner;
        this.toastr = toastr;
        this.user = user;
        this.router = router;
        this.users = [];
        this.userIdentification = {};
        this.isDisabled = false;
        this.messageSource = new BehaviorSubject('default message');
        this.currentMessage = this.messageSource.asObservable();
        // this.users=this.user.userData;
        // this.successMsg= false;
        // //console.log(this.users);
    }
    // public getUserInformation(){
    // this.user.fun(this.userid).subscribe (
    //   (res) => {
    //     this.arr=res as object [];
    //   //  //console.log("getting data for the user",this.arr);   
    //    this.semdet=res["sls"];
    //    this.roleName =res["role_check"];
    //    this.roles=res["user"];
    //    this.router.navigate(['user']);
    //   //  this.spinner.show();
    //   //  this.dataProvider.loadLookUpData().then(()=>{
    //   //   //console.log("done")
    //   //   this.dataProvider.loadLookUpTableData().then(()=>{
    //   //     //console.log("done2")
    //   //     this.spinner.hide();
    //   //   })
    //   // })
    //     // //console.log(this.roles);
    //   //  //console.log(this.semdet);
    //     this.user.myMethod(this.arr, this.userid);
    //     this.user.errorMethod(this.userid);
    //     // //console.log(this.roles);
    //     // //console.log(this.roleName)
    //     }, 
    //   (error) => {//console.log("FAILURE") } );
    // };
    //   loginUser(event?:any){
    //       this.userid=this.username;
    //       this.loading = true;
    //       // //console.log(this.userid);
    //       this.user.userId = this.userid;
    //       event.preventDefault();
    //     if(this.users.find(us=> (us.username == this.username && us.password == this.password)))
    //       {
    //         //console.log('success')
    //         this.user.SetUserDetails();
    //         this.getUserInformation();
    //         this.loading = true;
    //         this.toastr.success('Logged in successfully');
    //         this.isDisabled = true;
    //       }
    //     else {
    //         //console.log('failure');
    //         this.toastr.error('Login failed');
    //         this.loading = false;
    //       }
    // }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent = tslib_1.__decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [Http, NgxSpinnerService, ToastrService, AuthenticationService, Router])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map