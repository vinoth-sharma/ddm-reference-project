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
import * as $ from 'jquery';
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
var SemanticLayerMainComponent = /** @class */ (function () {
    function SemanticLayerMainComponent() {
        this.isCollapsed = true;
        this.formatter = function (result) { return result.toUpperCase(); };
        this.search = function (text$) {
            return text$.pipe(debounceTime(200), distinctUntilChanged(), map(function (term) { return term === '' ? []
                : states.filter(function (v) { return v.toLowerCase().indexOf(term.toLowerCase()) > -1; }).slice(0, 10); }));
        };
        this.sidebarFlag = 1;
    }
    SemanticLayerMainComponent.prototype.ngOnInit = function () {
        $(document).ready(function () {
            $('#sidebarCollapse').on('click', function () {
                $('#sidebar').toggleClass('active');
            });
        });
    };
    SemanticLayerMainComponent.prototype.widthSetting = function () {
        if (this.sidebarFlag == 1) {
            document.getElementById('main').style.width = "100%";
            this.sidebarFlag = 0;
        }
        else {
            document.getElementById('main').style.width = "80%";
            this.sidebarFlag = 1;
        }
    };
    SemanticLayerMainComponent.prototype.clickHome = function () {
        document.getElementById('home').style.backgroundColor = "rgb(250, 250, 250)";
        document.getElementById('reports').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('sl').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('rmp').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('dqm').style.backgroundColor = "rgb(210, 210, 210)";
    };
    SemanticLayerMainComponent.prototype.clickReports = function () {
        document.getElementById('reports').style.backgroundColor = "rgb(250, 250, 250)";
        document.getElementById('home').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('sl').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('rmp').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('dqm').style.backgroundColor = "rgb(210, 210, 210)";
    };
    SemanticLayerMainComponent.prototype.clickSL = function () {
        document.getElementById('sl').style.backgroundColor = "rgb(250, 250, 250)";
        document.getElementById('home').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('reports').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('rmp').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('dqm').style.backgroundColor = "rgb(210, 210, 210)";
    };
    SemanticLayerMainComponent.prototype.clickRMP = function () {
        document.getElementById('rmp').style.backgroundColor = "rgb(250, 250, 250)";
        document.getElementById('home').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('reports').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('sl').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('dqm').style.backgroundColor = "rgb(210, 210, 210)";
    };
    SemanticLayerMainComponent.prototype.clickDQM = function () {
        document.getElementById('dqm').style.backgroundColor = "rgb(250, 250, 250)";
        document.getElementById('home').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('reports').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('sl').style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById('rmp').style.backgroundColor = "rgb(210, 210, 210)";
    };
    SemanticLayerMainComponent = __decorate([
        Component({
            selector: 'app-semantic-layer-main',
            templateUrl: './semantic-layer-main.component.html',
            styleUrls: ['./semantic-layer-main.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], SemanticLayerMainComponent);
    return SemanticLayerMainComponent;
}());
export { SemanticLayerMainComponent };
//# sourceMappingURL=semantic-layer-main.component.js.map