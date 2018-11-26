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
var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'DDM';
        this.associates = [{
                role: 'Admin',
                firstname: 'Jacquelin',
                lastname: 'Beiter'
            },
            { role: 'Non-Admin', firstname: 'Aubrey', lastname: 'Dubberke' },
            { role: 'Report Viewer', firstname: 'Charlie', lastname: 'Chevoor' }
        ];
    }
    AppComponent.prototype.recieveUserdetails = function ($event) {
        this.roleId = $event;
        console.log(this.roleId);
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map