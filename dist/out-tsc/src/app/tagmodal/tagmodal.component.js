import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from "ngx-toastr";
var TagmodalComponent = /** @class */ (function () {
    function TagmodalComponent(toasterService) {
        this.toasterService = toasterService;
        this.statusCheck = false;
        this.newTags = [];
        this.saveTags = [];
        this.emitTags = new EventEmitter();
    }
    TagmodalComponent.prototype.ngOnInit = function () {
        this.reset();
    };
    TagmodalComponent.prototype.ngOnChanges = function () {
        this.reset();
    };
    TagmodalComponent.prototype.reset = function () {
        this.inputTag = '';
        this.exportTags = this.reportTags;
        this.newTags = [];
        this.searchTags = '';
        this.saveTags = [];
        this.changes = false;
    };
    TagmodalComponent.prototype.addTags = function () {
        if (this.exportTags.includes(this.inputTag) || this.newTags.includes(this.inputTag)) {
            this.toasterService.info("This tag already exists");
        }
        else {
            if (this.inputTag.trim() == '') {
                this.toasterService.info("Cannot save empty tags");
            }
            else {
                this.newTags.push(this.inputTag);
                this.inputTag = '';
                this.saveTags = this.newTags;
            }
        }
    };
    TagmodalComponent.prototype.removeTags = function (index) {
        this.exportTags.splice(index, 1);
        this.statusCheck = true;
    };
    TagmodalComponent.prototype.removeNewTags = function (index) {
        this.newTags.splice(index, 1);
        this.statusCheck = true;
    };
    TagmodalComponent.prototype.removeAll = function () {
        this.statusCheck = true;
        this.changes = true;
        this.exportTags = [];
        this.inputTag = '';
        this.newTags = [];
        this.reportTags = [];
    };
    TagmodalComponent.prototype.submitTags = function () {
        // this.statusCheck = false;
        this.exportTags = this.reportTags.concat(this.newTags);
        var data = {
            tag_name: this.exportTags
        };
        this.emitTags.emit(data);
    };
    TagmodalComponent.prototype.getTagsFromList = function (key) {
        // this.exportTags = this.reportTags.concat(this.newTags);
        if (key) {
            this.exportTags = this.exportTags.filter(function (item) {
                return item.toLowerCase().match(key.toLowerCase());
            });
            this.newTags = this.newTags.filter(function (item) {
                return item.toLowerCase().match(key.toLowerCase());
            });
        }
        else {
            this.exportTags = this.reportTags;
            this.newTags = this.saveTags;
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], TagmodalComponent.prototype, "reportTags", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], TagmodalComponent.prototype, "emitTags", void 0);
    TagmodalComponent = tslib_1.__decorate([
        Component({
            selector: 'app-tagmodal',
            templateUrl: './tagmodal.component.html',
            styleUrls: ['./tagmodal.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [ToastrService])
    ], TagmodalComponent);
    return TagmodalComponent;
}());
export { TagmodalComponent };
//# sourceMappingURL=tagmodal.component.js.map