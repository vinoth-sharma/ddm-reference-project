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
var SemanticSLComponent = /** @class */ (function () {
    function SemanticSLComponent() {
    }
    SemanticSLComponent.prototype.ngOnInit = function () {
    };
    SemanticSLComponent.prototype.newSM = function () {
        document.getElementById('new').style.backgroundColor = "rgb(87, 178, 252)";
        document.getElementById('existing').style.backgroundColor = "rgb(33, 150, 243)";
    };
    SemanticSLComponent.prototype.existingSM = function () {
        document.getElementById('existing').style.backgroundColor = "rgb(87, 178, 252)";
        document.getElementById('new').style.backgroundColor = "rgb(33, 150, 243)";
    };
    SemanticSLComponent = __decorate([
        Component({
            selector: 'app-semantic-sl',
            templateUrl: './semantic-sl.component.html',
            styleUrls: ['./semantic-sl.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], SemanticSLComponent);
    return SemanticSLComponent;
}());
export { SemanticSLComponent };
//# sourceMappingURL=semantic-sl.component.js.map