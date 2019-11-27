import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "../authentication.service";
import { SemdetailsService } from "../semdetails.service";
import { SemanticNewService } from "./semantic-new.service";
import { ObjectExplorerSidebarService } from "../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
import Utils from "../../utils";
import { MatExpansionPanel } from '@angular/material';
var SemanticNewComponent = /** @class */ (function () {
    function SemanticNewComponent(router, semanticNewService, authenticationService, toastrService, semdetailsService, objectExplorerSidebarService) {
        var _this = this;
        this.router = router;
        this.semanticNewService = semanticNewService;
        this.authenticationService = authenticationService;
        this.toastrService = toastrService;
        this.semdetailsService = semdetailsService;
        this.objectExplorerSidebarService = objectExplorerSidebarService;
        this.selectedItemsNew = [];
        this.selectedItemsExistingTables = [];
        this.selectedItemsNonExistingTables = [];
        this.columns = [];
        this.selectedTablesExisting = [];
        this.selectedTablesNonExisting = [];
        this.remainingTables = [];
        this.confHeader = "Save as";
        this.confText = "Save Semantic Layer as:";
        this.defaultError = "There seems to be an error. Please try again later.";
        this.existingTables = [];
        this.semanticLayers = [];
        this.allSemanticLayers = [];
        this.tablesNew = [];
        this.tablesCombined = [];
        this.isUpperDivDisabled = false;
        this.isLowerDivDisabled = true;
        this.data = {};
        this.panelOpenState = false;
        this.finalCustomTablesObjectArray = [];
        this.finalRemainingCustomTablesObjectArray = [];
        this.selectedTablesCustom = [];
        this.existingCustomTables = [];
        this.dropDownSettingsNew = {
            singleSelection: false,
            textField: 'mapped_table_name',
            idField: 'sl_tables_id',
            selectAllText: 'Select All',
            // itemsShowLimit: 18,
            allowSearchFilter: true,
            enableCheckAll: true,
            maxHeight: 160
        };
        this.dropdownSettingsNonExistingTables = {
            singleSelection: false,
            idField: 'table_num',
            textField: 'table_name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            // itemsShowLimit: 15,
            allowSearchFilter: true,
            enableCheckAll: true,
            maxHeight: 160
        };
        this.dropdownSettingsExistingTables = {
            singleSelection: false,
            idField: 'sl_tables_id',
            textField: 'mapped_table_name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            // itemsShowLimit: 15,
            allowSearchFilter: true,
            enableCheckAll: true,
            maxHeight: 160
        };
        this.dropdownSettingsCustomTables = {
            singleSelection: false,
            idField: 'custom_table_id',
            textField: 'custom_table_name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            // itemsShowLimit: 15,
            allowSearchFilter: true,
            enableCheckAll: true,
            maxHeight: 160
        };
        this.authenticationService.myMethod$.subscribe(function (res) {
            _this.sem = res['sls'];
            _this.getSemanticId();
        });
        this.authenticationService.Method$.subscribe(function (userId) { return _this.userId = userId; });
        this.semanticNewService.dataMethod$.subscribe(function (semanticLayers) { return _this.semanticLayers = semanticLayers; });
    }
    ;
    SemanticNewComponent.prototype.ngOnInit = function () {
        this.selectedItemsNew = [];
        this.selectedItemsExistingTables = [];
        this.selectedItemsNonExistingTables = [];
        this.selectedItemsCustomTables = [];
        this.selectedItemsRemainingCustomTables = [];
        this.getTables();
        this.getCustomTables();
    };
    SemanticNewComponent.prototype.getSemanticId = function () {
        var _this = this;
        this.router.config.forEach(function (element) {
            if (element.path == "semantic") {
                _this.semanticId = element.data["semantic_id"];
            }
        });
    };
    SemanticNewComponent.prototype.fetchSemantic = function (event) {
        var _this = this;
        if (!event.target.value) {
            this.selectedItemsExistingTables = [];
            this.selectedItemsNonExistingTables = [];
            this.selectedItemsCustomTables = [];
            this.selectedItemsRemainingCustomTables = [];
            this.columns = [];
            this.remainingTables = [];
            return;
        }
        this.sem = this.semanticLayers;
        var isValid = this.sem.map(function (el) { return el.sl_name; }).includes(this.inputSemanticValue);
        var semanticLayerName = event.target.value.substr(event.target.value.indexOf(' ') + 1);
        if (isValid || !this.inputSemanticValue.length) {
            this.sls = this.sem.find(function (x) { return x.sl_name == semanticLayerName; }).sl_id;
            Utils.showSpinner();
            this.semdetailsService.fetchsem(this.sls).subscribe(function (res) {
                _this.columns = res["data"]["sl_table"];
                // console.log("this.columns data format INITIAL : ",this.columns)
                // this.columns.sort(function(a,b){
                //   let d1 = new Date(a.mapped_table_name);
                //   let d2 = new Date(b.mapped_table_name); 			
                //   if(d1>d2){return -1;}	
                //   else if(d1 == d2){return 0;}	
                //   else{return 1;} 
                // })
                if (_this.columns.length) {
                    var columnsSorted = _this.columns.sort(function (a, b) {
                        a = a.mapped_table_name.toLowerCase();
                        b = b.mapped_table_name.toLowerCase();
                        return (a < b) ? -1 : (a > b) ? 1 : 0;
                    });
                    _this.columns = columnsSorted;
                    // console.log("this.columns data format SORTED!! : ",this.columns)
                }
            });
            this.objectExplorerSidebarService.getAllTables(this.sls).subscribe(function (response) {
                if (response) {
                    _this.remainingTables = response['data'];
                    // console.log("this.remainingTables data format INITIAL : ",this.remainingTables)
                    if (_this.remainingTables.length) {
                        var remainingTablesSorted = _this.remainingTables.sort(function (a, b) {
                            a = a.table_name.toLowerCase();
                            b = b.table_name.toLowerCase();
                            return (a < b) ? -1 : (a > b) ? 1 : 0;
                        });
                        _this.remainingTables = remainingTablesSorted;
                    }
                    // console.log("this.columns data format SORTED : ",this.columns)
                }
            }, function (error) {
                _this.toastrService.error(error.message || _this.defaultError);
                Utils.hideSpinner();
            });
            this.semdetailsService.getviews(this.sls).subscribe(function (res) {
                // // console.log("GETTING the custom tables:",res);
                if (res) {
                    var customTables = res['data']['sl_view'];
                    // // console.log("custom-data for testing:",customTables);
                    var targetCustomTablesCopy = tslib_1.__spread(_this.existingCustomTables);
                    var targetCustomTablesCopy2_1 = tslib_1.__spread(_this.existingCustomTables);
                    var subCustomTablesCopy_1 = tslib_1.__spread(customTables);
                    var finalCustomTables_1 = {};
                    var customTablesObjectArray_1 = [];
                    customTables.map(function (i) { customTablesObjectArray_1.push(finalCustomTables_1[i.custom_table_id] = i.custom_table_name); });
                    // // console.log("PROCURED customTables",customTables);
                    var customTableIds_1 = customTables.map(function (i) { return i.custom_table_id; });
                    // // console.log("PROCURED customTableIds",customTableIds);
                    var customTableNames_1 = customTables.map(function (i) { return i.custom_table_name; });
                    // // console.log("PROCURED customTableNames",customTableNames);
                    _this.finalCustomTablesObjectArray = [];
                    ;
                    customTableNames_1.map(function (d, i) {
                        _this.finalCustomTablesObjectArray.push({ custom_table_id: customTableIds_1[i], custom_table_name: customTableNames_1[i] });
                    });
                    // console.log("this.finalCustomTablesObjectArray INITIAL value:",this.finalCustomTablesObjectArray);
                    if (_this.finalCustomTablesObjectArray.length) {
                        var finalCustomTablesObjectArraySorted = _this.finalCustomTablesObjectArray.sort(function (a, b) {
                            a = a.custom_table_name.toLowerCase();
                            b = b.custom_table_name.toLowerCase();
                            return (a < b) ? -1 : (a > b) ? 1 : 0;
                        });
                        _this.finalCustomTablesObjectArray = finalCustomTablesObjectArraySorted;
                        // console.log("this.finalCustomTablesObjectArray SORTED:",this.finalCustomTablesObjectArray);
                    }
                    targetCustomTablesCopy.filter(function (i) {
                        subCustomTablesCopy_1.filter(function (t) {
                            if ((t.custom_table_id === i.custom_table_id)) {
                                // console.log('element caught : ',t);
                                targetCustomTablesCopy2_1.splice(t, 1);
                            }
                        });
                    });
                    _this.finalRemainingCustomTablesObjectArray = targetCustomTablesCopy2_1;
                    // console.log("this.finalRemainingCustomTablesObjectArray INITIAL value:",this.finalRemainingCustomTablesObjectArray);
                    //sort logic1
                    if (_this.finalRemainingCustomTablesObjectArray.length) {
                        var finalRemainingCustomTablesObjectArraySorted = _this.finalRemainingCustomTablesObjectArray.sort(function (a, b) {
                            a = a.custom_table_name.toLowerCase();
                            b = b.custom_table_name.toLowerCase();
                            return (a < b) ? -1 : (a > b) ? 1 : 0;
                        });
                        _this.finalRemainingCustomTablesObjectArray = finalRemainingCustomTablesObjectArraySorted;
                        // console.log("this.finalRemainingCustomTablesObjectArray SORTED:",this.finalRemainingCustomTablesObjectArray);
                    }
                }
            });
            this.selectedItemsExistingTables = [];
            this.selectedItemsNonExistingTables = [];
            this.selectedItemsCustomTables = [];
            Utils.hideSpinner();
        }
        else {
            Utils.showSpinner();
            this.selectedItemsExistingTables = [];
            this.selectedItemsNonExistingTables = [];
            this.selectedItemsCustomTables = [];
            this.selectedItemsRemainingCustomTables = [];
            this.remainingTables = [];
            this.columns = [];
            Utils.hideSpinner();
            this.toastrService.error("Please enter existing Semantic layer value!");
        }
    };
    ;
    SemanticNewComponent.prototype.checkEmpty = function () {
        var _this = this;
        // checks for the required inputs  
        if (!this.inputSemanticValue && !this.selectedItemsExistingTables.length && !this.selectedItemsNonExistingTables.length) {
            this.toastrService.error("All fields need to be filled to create a Semantic layer");
        }
        else {
            // checks for duplicate values
            if (this.sem.find(function (ele) { return ele.sl_name == _this.inputSemanticValue; })) {
                document.getElementById("open-modal-btn").click();
            }
            else {
                this.toastrService.error("Please enter existing Semantic layer value!");
            }
        }
    };
    SemanticNewComponent.prototype.saveSemantic = function (value) {
        this.finalName = value;
        // checks for duplicate values in 'Save as' modal
        if (this.sem.find(function (ele) { return ele.sl_name.toUpperCase() === value.trim().toUpperCase() || !value.trim().length; })) {
            this.toastrService.error("Please enter a unique name for the Semantic layer.");
        }
        else {
            this.createSemanticLayer(this.data);
            // this.createSemanticLayer();
        }
    };
    SemanticNewComponent.prototype.getTables = function () {
        var _this = this;
        this.authenticationService.getTables(this.semanticId).subscribe(function (response) {
            _this.existingTables = response['data']['sl_table'];
            // console.log("this.existingTables check INITIAL",this.existingTables);
            if (_this.existingTables.length) {
                var existingTablesSorted = _this.existingTables.sort(function (a, b) {
                    a = a.mapped_table_name.toLowerCase();
                    b = b.mapped_table_name.toLowerCase();
                    return (a < b) ? -1 : (a > b) ? 1 : 0;
                });
                _this.existingTables = existingTablesSorted;
                // console.log("this.existingTables check SORTED!!!!",this.existingTables);
            }
        }, function (error) { return _this.toastrService.error(error['message']); });
    };
    SemanticNewComponent.prototype.getCustomTables = function () {
        var _this = this;
        this.authenticationService.getCustomTablesDetails().subscribe(function (res) {
            if (res) {
                // // console.log("ALL custom table details : ", res);
                _this.existingCustomTables = res;
                // console.log("this.existingCustomTables INITIAL",this.existingCustomTables);
                if (_this.existingCustomTables.length) {
                    var existingCustomTablesSorted = _this.existingCustomTables.sort(function (a, b) {
                        a = a.custom_table_name.toLowerCase();
                        b = b.custom_table_name.toLowerCase();
                        return (a < b) ? -1 : (a > b) ? 1 : 0;
                    });
                    _this.existingCustomTables = existingCustomTablesSorted;
                    // console.log("this.existingTables check SORTED!!!!",this.existingTables);
                }
                // this.remainingCustomTables 
            }
        });
    };
    SemanticNewComponent.prototype.getSemanticLayers = function () {
        var _this = this;
        Utils.showSpinner();
        this.authenticationService.getSldetails(this.userId).subscribe(function (response) {
            _this.semanticLayers = response['data']['sl_list'];
            _this.toastrService.success(_this.toasterMessage);
            Utils.hideSpinner();
        }, function (error) {
            _this.toastrService.error(error['message']);
        });
        this.authenticationService.fun(this.userId).subscribe(function (response) {
            _this.semDetails = response["sls"];
            _this.authenticationService.setSlMethod(_this.semDetails);
        }, function (error) {
            _this.toastrService.error(error['message']);
        });
        this.authenticationService.getSldetails(this.userId).subscribe(function (res) {
            _this.semanticList = res['data']['sl_list'];
            _this.semanticNewService.dataMethod(_this.semanticList);
        });
    };
    ;
    SemanticNewComponent.prototype.createSemanticLayer = function (data) {
        var _this = this;
        if (this.firstName.length) {
            // do nothing as data is already set
        }
        else {
            data['sl_name'] = this.finalName.trim();
            data['sl_table_ids'] = this.tablesCombined;
        }
        Utils.showSpinner();
        this.semanticNewService.createSemanticLayer(data).subscribe(function (response) {
            var semanticList = {};
            _this.toasterMessage = response['message'];
            _this.getSemanticLayers();
            _this.reset();
            Utils.closeModals();
            _this.sem = _this.semanticLayers;
            _this.selectedTablesExisting = [];
            _this.selectedTablesNonExisting = [];
            _this.finalCustomTablesObjectArray = [];
        }, function (error) {
            _this.toastrService.error(error['message']['error']);
            // this.selectedTablesExisting = [];
            // this.selectedTablesNonExisting = [];
            Utils.hideSpinner();
        });
    };
    ;
    SemanticNewComponent.prototype.onItemSelectNew = function (item) {
        this.tablesNew.push(item.sl_tables_id);
    };
    ;
    SemanticNewComponent.prototype.onItemDeSelectNew = function (item) {
        var index = this.tablesNew.indexOf(item.sl_tables_id);
        this.tablesNew.splice(index, 1);
    };
    ;
    SemanticNewComponent.prototype.onSelectAllNew = function (items) {
        var _this = this;
        this.tablesNew = [];
        items.forEach(function (element) { return _this.tablesNew.push(element.sl_tables_id); });
    };
    SemanticNewComponent.prototype.onDeSelectAllNew = function (event) {
        this.tablesNew = [];
    };
    // /////////////////////////////////////////////////////////////////////////////////////////////////
    SemanticNewComponent.prototype.onItemSelectExisting = function (item) {
        this.selectedTablesExisting.push(item.sl_tables_id);
    };
    SemanticNewComponent.prototype.onItemDeSelectExisting = function (item) {
        var index = this.selectedTablesExisting.indexOf(item.sl_tables_id);
        this.selectedTablesExisting.splice(index, 1);
    };
    SemanticNewComponent.prototype.onSelectAllExisting = function (items) {
        var _this = this;
        this.selectedTablesExisting = [];
        items.forEach(function (element) { return _this.selectedTablesExisting.push(element.sl_tables_id); });
    };
    SemanticNewComponent.prototype.onDeSelectAllExisting = function (event) {
        this.selectedTablesExisting = [];
    };
    // ////////////////////////////////////////////////////////////////////////////////////////////////////
    SemanticNewComponent.prototype.onItemSelectNonExisting = function (item) {
        this.selectedTablesNonExisting.push(item.table_num);
    };
    SemanticNewComponent.prototype.onItemDeSelectNonExisting = function (item) {
        var index = this.selectedTablesNonExisting.indexOf(item.table_num);
        this.selectedTablesNonExisting.splice(index, 1);
    };
    SemanticNewComponent.prototype.onSelectAllNonExisting = function (items) {
        var _this = this;
        this.selectedTablesNonExisting = [];
        items.forEach(function (element) { return _this.selectedTablesNonExisting.push(element.table_num); });
    };
    SemanticNewComponent.prototype.onDeSelectAllNonExisting = function (event) {
        this.selectedTablesNonExisting = [];
    };
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////
    SemanticNewComponent.prototype.onItemSelectCustomExisting = function (item) {
        this.selectedTablesCustom.push(item.custom_table_id);
        // // console.log("FINAL ITEMS-selectedTablesCustom: ",this.selectedTablesCustom);
    };
    SemanticNewComponent.prototype.onItemDeSelectCustomExisting = function (item) {
        var index = this.selectedTablesCustom.indexOf(item.custom_table_id);
        this.selectedTablesCustom.splice(index, 1);
        // // console.log("FINAL ITEMS-selectedTablesCustom: ",this.selectedTablesCustom);
    };
    SemanticNewComponent.prototype.onSelectAllCustomExisting = function (items) {
        var _this = this;
        // // console.log("SELECTED ITEMS for SELECT ALL:",items)
        this.selectedTablesCustom = [];
        items.map(function (element) { return _this.selectedTablesCustom.push(element.custom_table_id); });
        // // console.log("FINAL ITEMS-selectedTablesCustom: ",this.selectedTablesCustom);
    };
    SemanticNewComponent.prototype.onDeSelectAllCustomExisting = function (event) {
        this.selectedTablesCustom = [];
        // // console.log("FINAL ITEMS-selectedTablesCustom: ",this.selectedTablesCustom);
    };
    // /////////////////////////////////////////////////////////////////////////////////////////
    SemanticNewComponent.prototype.onItemSelectCustomNonExisting = function (item) {
        this.selectedTablesCustom.push(item.custom_table_id);
        // // console.log("FINAL ITEMS-selectedTablesCustom: ",this.selectedTablesCustom);
    };
    SemanticNewComponent.prototype.onItemDeSelectCustomNonExisting = function (item) {
        var index = this.selectedTablesCustom.indexOf(item.custom_table_id);
        this.selectedTablesCustom.splice(index, 1);
        // // console.log("FINAL ITEMS-selectedTablesCustom: ",this.selectedTablesCustom);
    };
    SemanticNewComponent.prototype.onSelectAllCustomNonExisting = function (items) {
        var _this = this;
        // // console.log("SELECTED ITEMS for SELECT ALL:",items)
        this.selectedTablesCustom = [];
        items.map(function (element) { return _this.selectedTablesCustom.push(element.custom_table_id); });
        // // console.log("FINAL ITEMS-selectedTablesCustom: ",this.selectedTablesCustom);
    };
    SemanticNewComponent.prototype.onDeSelectAllCustomNonExisting = function (event) {
        this.selectedTablesCustom = [];
        // // console.log("FINAL ITEMS-selectedTablesCustom: ",this.selectedTablesCustom);
    };
    // /////////////////////////////////////////////////////////////////////////////////////////////
    SemanticNewComponent.prototype.validateInputField = function () {
        var _this = this;
        if (!this.firstName || !this.firstName.trim() || !this.tablesNew.length) {
            this.toastrService.error('All fields need to be filled to create a Semantic layer');
            return false;
        }
        else {
            this.objectExplorerSidebarService.checkUnique().subscribe(function (res) {
                // //// console.log("ALL SEMANTIC LAYERS:",res)
                _this.allSemanticLayers = res['existing_sl_list'];
            });
            if (this.allSemanticLayers.find(function (ele) { return ele.toUpperCase() === _this.firstName.trim().toUpperCase() || !_this.firstName.trim().length; })) {
                this.toastrService.error("Please enter a unique name for the Semantic layer.");
                return false;
            }
        }
        return true;
    };
    ;
    SemanticNewComponent.prototype.saveProcess = function () {
        this.data['user_id'] = [this.userId];
        if (!this.isUpperDivDisabled && !this.isLowerDivDisabled) {
        }
        else if (this.isLowerDivDisabled) {
            //writing new-sem logic here
            if (!this.validateInputField())
                return;
            this.data['sl_name'] = this.firstName.trim();
            this.data['sl_table_ids'] = this.tablesNew;
            if (this.selectedTablesCustom) {
                this.data['custom_table_ids'] = this.selectedTablesCustom;
            }
            this.createSemanticLayer(this.data);
        }
        else if (this.isUpperDivDisabled) {
            //writing existing-sem logic here
            //change nbelow logic and then take any of the three??or just send the ids separately
            if (this.selectedTablesExisting.length && !this.selectedTablesNonExisting.length) {
                this.tablesCombined = this.selectedTablesExisting;
            }
            if (this.selectedTablesNonExisting.length && !this.selectedTablesExisting.length) {
                this.tablesCombined = this.selectedTablesNonExisting;
            }
            if (this.selectedTablesNonExisting.length && this.selectedTablesExisting.length) {
                this.tablesCombined = this.selectedTablesExisting.concat(this.selectedTablesNonExisting);
            }
            if (this.selectedTablesNonExisting.length == 0 && this.selectedTablesExisting.length == 0) {
                // this.tablesCombined = this.selectedTablesExisting.concat(this.selectedTablesNonExisting);
                this.toastrService.error("Please select any table(s) from one of the below dropdowns");
                return;
            }
            this.data['sl_table_ids'] = this.tablesCombined;
            this.data['custom_table_ids'] = this.selectedTablesCustom;
            // // console.log("SUBMITTING TOTAL DATA:",this.data)
            this.checkEmpty();
        }
        else {
            this.checkEmpty();
        }
    };
    SemanticNewComponent.prototype.disableLowerDiv = function () {
        this.reset();
        this.isLowerDivDisabled = true;
        this.isUpperDivDisabled = false;
        this.inputSemanticValue = '';
        this.selectedItemsExistingTables = [];
        this.selectedItemsNonExistingTables = [];
        this.selectedTablesCustom = [];
        this.selectedItemsCustomTables = [];
        this.selectedItemsRemainingCustomTables = [];
        this.tablesCombined = [];
    };
    SemanticNewComponent.prototype.disableUpperDiv = function () {
        this.reset();
        this.isLowerDivDisabled = false;
        this.isUpperDivDisabled = true;
        this.firstName = '';
        this.selectedItemsNew = [];
        this.descriptionField = [];
        this.selectedTablesCustom = [];
        this.selectedItemsCustomTables = [];
        this.tablesNew = [];
    };
    SemanticNewComponent.prototype.reset = function () {
        if (this.isLowerDivDisabled && !this.isUpperDivDisabled) {
            this.firstName = "";
            this.selectedItemsNew = [];
            this.descriptionField = '';
            this.selectedTablesCustom = [];
            this.selectedItemsCustomTables = [];
        }
        else {
            this.inputSemanticValue = "";
            this.selectedItemsExistingTables = [];
            this.selectedItemsNonExistingTables = [];
            this.selectedItemsCustomTables = [];
            this.selectedItemsRemainingCustomTables = [];
            this.selectedTablesCustom = [];
        }
    };
    SemanticNewComponent = tslib_1.__decorate([
        Component({
            selector: 'app-semantic-new',
            templateUrl: './semantic-new.component.html',
            styleUrls: ['./semantic-new.component.css'],
            viewProviders: [MatExpansionPanel]
        }),
        tslib_1.__metadata("design:paramtypes", [Router,
            SemanticNewService,
            AuthenticationService,
            ToastrService,
            SemdetailsService,
            ObjectExplorerSidebarService])
    ], SemanticNewComponent);
    return SemanticNewComponent;
}());
export { SemanticNewComponent };
//# sourceMappingURL=semantic-new.component.js.map