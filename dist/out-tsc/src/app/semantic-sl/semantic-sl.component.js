import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SemanticNewService } from '../semantic-new/semantic-new.service';
import { AuthenticationService } from '../authentication.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
var SemanticSLComponent = /** @class */ (function () {
    function SemanticSLComponent(router, toastrService, spinner, semanticNewService, authenticationService) {
        var _this = this;
        this.router = router;
        this.toastrService = toastrService;
        this.spinner = spinner;
        this.semanticNewService = semanticNewService;
        this.authenticationService = authenticationService;
        this.semanticLayers = [];
        this.semanticNewService.dataMethod$.subscribe(function (semanticLayers) { _this.semanticLayers = semanticLayers; });
        this.authenticationService.Method$.subscribe(function (userId) { return _this.userId = userId; });
        this.authenticationService.myMethod$.subscribe(function (role) {
            if (role) {
                _this.userRole = role["role"];
            }
        });
        // this.ngOnInit() // used here to solve a particular bug,look over here!!!!!
    }
    SemanticSLComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.router.url === '/semantic/sem-sl/sem-existing' || this.router.url === '/semantic/sem-sl/sem-new') {
            this.getSemanticLayers();
        }
        this.authenticationService.slRoute$.subscribe(function (routeValue) { _this.routeValue = routeValue; });
        // this.authenticationService.getCustomTables().subscribe(res=>{ 
        //   if(res){
        //     console.log("ALL custom table details : ", res)
        //   }
        // })
    };
    SemanticSLComponent.prototype.getSemanticLayers = function () {
        var _this = this;
        this.isLoading = true;
        // this.spinner.show("mini");
        this.authenticationService.getSldetails(this.userId).subscribe(function (res) {
            _this.semanticLayers = res['data']['sl_list'];
            _this.semanticNewService.dataMethod(_this.semanticLayers);
            _this.isLoading = false;
            // this.spinner.hide("mini")
        }, function (err) {
            _this.toastrService.error(err['message']);
        });
    };
    ;
    SemanticSLComponent = tslib_1.__decorate([
        Component({
            selector: 'app-semantic-sl',
            templateUrl: './semantic-sl.component.html',
            styleUrls: ['./semantic-sl.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [Router, ToastrService, NgxSpinnerService, SemanticNewService, AuthenticationService])
    ], SemanticSLComponent);
    return SemanticSLComponent;
}());
export { SemanticSLComponent };
//# sourceMappingURL=semantic-sl.component.js.map