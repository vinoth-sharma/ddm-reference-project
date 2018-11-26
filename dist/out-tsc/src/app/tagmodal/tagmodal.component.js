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
import { Contact } from '../contact';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
var TagmodalComponent = /** @class */ (function () {
    function TagmodalComponent() {
        var _this = this;
        this.formatter = function (result) { return result.toUpperCase(); };
        this.search = function (text$) {
            return text$.pipe(debounceTime(200), distinctUntilChanged(), map(function (term) { return term.length < 2 ? []
                : _this.contacts.filter(function (v) { return v.toLowerCase().indexOf(term.toLowerCase()) > -1; }).slice(0, 10); }));
        };
        this.contacts = [];
    }
    TagmodalComponent.prototype.addContact = function (name) {
        var contact = new Contact(name);
        this.contacts.push(contact.name);
    };
    TagmodalComponent.prototype.removeContact = function (contact) {
        var index = this.contacts.indexOf(contact);
        this.contacts.splice(index, 1);
    };
    TagmodalComponent.prototype.removeAll = function (contact) {
        this.contacts = [];
    };
    TagmodalComponent = __decorate([
        Component({
            selector: 'app-tagmodal',
            templateUrl: './tagmodal.component.html',
            styleUrls: ['./tagmodal.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], TagmodalComponent);
    return TagmodalComponent;
}());
export { TagmodalComponent };
//# sourceMappingURL=tagmodal.component.js.map