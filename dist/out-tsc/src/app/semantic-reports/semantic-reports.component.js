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
import { ReportbuilderService } from '../reportbuilder.service';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
var SemanticReportsComponent = /** @class */ (function () {
    function SemanticReportsComponent(svc, formBuilder) {
        var _this = this;
        this.svc = svc;
        this.formBuilder = formBuilder;
        this.svc.task().subscribe(function (resp) {
            _this.orders = resp;
            console.log(_this.orders);
            var controls = _this.orders.map(function (c) { return new FormControl(false); });
            controls[0].setValue(true); // Set the first checkbox to true (checked)
            _this.form = _this.formBuilder.group({
                orders: new FormArray(controls)
            });
        });
    }
    SemanticReportsComponent.prototype.ngOnInit = function () {
    };
    SemanticReportsComponent.prototype.submit = function () {
        var _this = this;
        var selectedOrderIds = this.form.value.orders
            .map(function (v, i) { return v ? _this.orders[i].id : null; })
            .filter(function (v) { return v !== null; });
        console.log(selectedOrderIds);
    };
    SemanticReportsComponent = __decorate([
        Component({
            selector: 'app-semantic-reports',
            templateUrl: './semantic-reports.component.html',
            styleUrls: ['./semantic-reports.component.css']
        }),
        __metadata("design:paramtypes", [ReportbuilderService, FormBuilder])
    ], SemanticReportsComponent);
    return SemanticReportsComponent;
}());
export { SemanticReportsComponent };
//# sourceMappingURL=semantic-reports.component.js.map