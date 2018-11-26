var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
// Dummy array for search bar
var states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
    'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
var ModalColumnComponent = /** @class */ (function () {
    function ModalColumnComponent() {
        this.dropdownList = [];
        this.selectedItems = [];
        this.dropdownSettings = {};
        this.formatter = function (result) { return result.toUpperCase(); };
        this.search = function (text$) {
            return text$.pipe(debounceTime(200), distinctUntilChanged(), map(function (term) { return term === '' ? []
                : states.filter(function (v) { return v.toLowerCase().indexOf(term.toLowerCase()) > -1; }).slice(0, 10); }));
        };
    }
    ModalColumnComponent.prototype.ngOnInit = function () {
        this.dropdownList = [
            { item_id: 1, item_text: 'Mumbai' },
            { item_id: 2, item_text: 'Bangaluru' },
            { item_id: 3, item_text: 'Pune' },
            { item_id: 4, item_text: 'Navsari' },
            { item_id: 5, item_text: 'New Delhi' }
        ];
        this.selectedItems = [];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };
    };
    ModalColumnComponent.prototype.onItemSelect = function (item) {
        console.log(item);
    };
    ModalColumnComponent.prototype.onSelectAll = function (items) {
        console.log(items);
    };
    ModalColumnComponent = __decorate([
        Component({
            selector: 'app-modal-column',
            templateUrl: './modal-column.component.html',
            styleUrls: ['./modal-column.component.css']
        })
    ], ModalColumnComponent);
    return ModalColumnComponent;
}());
export { ModalColumnComponent };
//# sourceMappingURL=modal-column.component.js.map