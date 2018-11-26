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
var RmpLandingPageComponent = /** @class */ (function () {
    function RmpLandingPageComponent() {
    }
    RmpLandingPageComponent.prototype.ngOnInit = function () {
    };
    RmpLandingPageComponent.prototype.editing = function () {
        document.getElementById("edit").setAttribute('contenteditable', "true");
        document.getElementById("saving").style.display = "block";
    };
    RmpLandingPageComponent.prototype.saving_content = function () {
        document.getElementById("edit").setAttribute('contenteditable', "false");
        document.getElementById("saving").style.display = "none";
    };
    RmpLandingPageComponent = __decorate([
        Component({
            selector: 'app-rmp-landing-page',
            templateUrl: './rmp-landing-page.component.html',
            styleUrls: ['./rmp-landing-page.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], RmpLandingPageComponent);
    return RmpLandingPageComponent;
}());
export { RmpLandingPageComponent };
//# sourceMappingURL=rmp-landing-page.component.js.map