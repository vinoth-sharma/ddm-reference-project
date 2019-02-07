import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { Router, ActivatedRoute } from "@angular/router";
import { SemdetailsService } from "../../../semdetails.service";
import { AuthenticationService } from "../../../authentication.service";
import { ObjectExplorerSidebarService } from "./object-explorer-sidebar.service";
import { ToastrService } from "ngx-toastr";
import Utils from "../../../../utils";
import { ReportsService } from "../../../reports/reports.service";
import { SidebarToggleService } from "../sidebar-toggle.service";

@Component({
  selector: "app-object-explorer-sidebar",
  templateUrl: "./object-explorer-sidebar.component.html",
  styleUrls: ["./object-explorer-sidebar.component.css"]
})

export class ObjectExplorerSidebarComponent implements OnInit {

  public columns = [];
  public button;
  public semList;
  public isShow = false;
  public Show = false;
  public semantic_name;
  public isCollapsed = false;
  public EnableCustomSearch = false;
  public isLoading: boolean;
  public Loading: boolean;
  public loader: boolean;
  public originalTables;
  public dependentReports = [];
  public tables = [];
  public action: string = '';
  public selectedTables = [];
  public isCustomTable: boolean;
  public confirmFn;
  public confirmText: string = '';
  public semanticId: number; views; customData;arr; roles; roleName; sidebarFlag; errorMsg; info; properties;
  public values;
  public relatedTables;
  defaultError = "There seems to be an error. Please try again later.";

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private user: AuthenticationService,
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private semanticService: SemdetailsService,
    private toasterService: ToastrService,
    private reportsService:ReportsService,
    private toggleService:SidebarToggleService) {

    this.semanticService.myMethod$.subscribe(columns => {
      this.columns = Array.isArray(columns) ? columns : [];
      this.originalTables = JSON.parse(JSON.stringify(this.columns));
    });
    this.semanticId = this.activatedRoute.snapshot.data['semantic_id'];

    this.objectExplorerSidebarService.footmethod$.subscribe((errorMsg) => {
      this.errorMsg = errorMsg;
    });
    this.objectExplorerSidebarService.viewMethod$.subscribe((views) => {
      this.views = views;
      this.customData = JSON.parse(JSON.stringify(views));
    })
    this.user.myMethod$.subscribe((arr) =>
      this.arr = arr
    );
    this.roles = this.arr.user;
    this.roleName = this.arr.role_check;
    this.sidebarFlag = 1;
  }


  ngOnInit() {
    this.semantic_name = this.activatedRoute.snapshot.data["semantic"];


    $(document).ready(function () {
      $("#sidebarCollapse").on("click", function () {
        $("#sidebar").toggleClass("active");
      });
    });
  }

  showtables(i) {
    this.button = i;
    this.isShow = !this.isShow;
  }

  public toggle() {
    $("#sidebar").toggleClass("active");
    this.toggleService.setToggle(false);
  }

  public renameTable(obj, type, data?, index?) {
    let options = {};
    options["table_id"] = obj.table_id;
    options["sl_id"] = this.activatedRoute.snapshot.data["semantic_id"];
    if (type == "column") {
      options["old_column_name"] = obj.old_val;
      options["new_column_name"] = obj.table_name;
      this.objectExplorerSidebarService.saveColumnName(options).subscribe(
        res => {
          this.toasterService.success("Column rename has been changed successfully");
          data.mapped_column_name[index] = obj.table_name
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
        }
      );
    } else if (type == "semantic") {
      options["slId"] = this.activatedRoute.snapshot.data["semantic_id"];
      options["old_semantic_layer"] = obj.old_val;
      options["new_semantic_layer"] = obj.table_name;
      this.objectExplorerSidebarService.updateSemanticName(options).subscribe(
        res => {
          this.semantic_name = obj.table_name;
          this.activatedRoute.snapshot.data["semantic"] = obj.table_name;
          this.toasterService.success("Semantic Layer has been renamed successfully")
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
        }
      );
    }
    else {
      options["table_name"] = obj.table_name;
      this.objectExplorerSidebarService.saveTableName(options).subscribe(
        res => {
          this.toasterService.success("Table rename has been changed successfully");
          data.mapped_table_name = obj.table_name;
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
        }
      );
    }
  }

  public showviews(j) {
    this.button = j;
    this.Show = !this.Show;
  };

  public getDependentReports(tableId: number) {
    this.isLoading = true;
    this.selectedTables = [];
    this.selectedTables.push(tableId);
    this.confirmFn = this.deleteTables;
    this.confirmText = 'Are you sure you want to delete the table(s)?';
    this.objectExplorerSidebarService.getReports(tableId).subscribe(response => {
      this.dependentReports = response['dependent_reports'];
      this.isLoading = false;
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    })
  }

  public removeCustomTable(tableId: number) {
    this.isCustomTable = true;
    this.isLoading = true;
    this.selectedTables = [];
    this.selectedTables.push(tableId);
    this.confirmText = 'Are you sure you want to delete the table(s)?';
    this.confirmFn = function () {

      Utils.showSpinner();
      this.deleteTables(response => {
        this.toasterService.success(response['message'])
        Utils.hideSpinner();
        Utils.closeModals();

      }, error => {
        this.toasterService.error(error.message['error'] || this.defaultError);
        Utils.hideSpinner();
        Utils.closeModals();
      });
    };
  }


  public setSelectedTables(tables: any[]) {
    if (this.action === 'ADD') {
      this.selectedTables = tables.map(t => t['table_name']);
    }
    else if (this.action === 'REMOVE') {
      this.selectedTables = tables.map(t => t['sl_tables_id'])
    }
    else if (this.action === 'REMOVECUSTOM') {
      this.selectedTables = tables.map(t => t['custom_table_id'])
    }
  }

  public listofvalues(column, table_id) {
    this.Loading = true;
    let options = {};
    options['columnName'] = column;
    options['tableId'] = table_id;
    this.objectExplorerSidebarService.listValues(options).subscribe(res => {
      this.values = res as object[];
      this.Loading = false;
    })
  }

  public columnProperties(table_id, column) {
    this.loader = true;
    let options = {};
    options['columnName'] = column;
    options['tableId'] = table_id;
    this.objectExplorerSidebarService.colProperties(options).subscribe(res => {
      this.properties = res as object[];
      this.loader = false;
    })
  }

  public deleteTables() {
    Utils.showSpinner();
    if(!this.isCustomTable){
      this.objectExplorerSidebarService.deleteTables(this.selectedTables).subscribe(response => {
        this.toasterService.success(response['message'])
        this.resetSelection();
      }, error => {
        this.toasterService.error(error.message['error'] || this.defaultError);
        this.resetSelection();
      });
    }else{
      this.objectExplorerSidebarService.deleteCustomTables(this.selectedTables).subscribe(response => {
        this.toasterService.success(response['message'])
        this.resetSelection();
      }, error => {
        this.toasterService.error(error.message['error'] || this.defaultError);
        this.resetSelection();
      });

    }
  }


  public updateView(view_to_admins, tables_id) {
    let options = {};
    if (view_to_admins) {
      options['view'] = 1;
    } else {
      options['view'] = 0;
    }
    options['table_id'] = tables_id;
    this.objectExplorerSidebarService.ChangeView(options).subscribe();
  };

  public addTables() {
    let data = {
      sl_id: this.semanticId,
      tables: this.selectedTables
    }
    Utils.showSpinner();

    this.objectExplorerSidebarService.addTables(data).subscribe(response => {
      this.toasterService.success(response['message'])
      this.resetSelection();
    }, error => {
      this.toasterService.error(error.message['error'] || this.defaultError);
      this.resetSelection();
    });
  }

  public getSemanticLayerTables() {
    this.isLoading = true;
    this.selectedTables = [];
    this.semanticService.fetchsem(this.semanticId).subscribe(response => {
      this.columns = response['data']['sl_table'];
      this.tables = response['data']['sl_table'];
      this.isLoading = false;
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    })
  }

  public getAllTables() {
    this.isLoading = true;
    this.selectedTables = [];
    this.objectExplorerSidebarService.getAllTables(this.semanticId).subscribe(response => {
      this.tables = response['data'];
      this.isLoading = false;
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    })
  }

  public setAction(action: string) {
    this.action = action;
    this.tables = [];
    this.selectedTables = [];
    if (action === 'REMOVE' || action === 'REMOVECUSTOM') {
      this.isCustomTable = (action !== 'REMOVE')
      this.getSemanticLayerTables();
      this.confirmFn = this.deleteTables;
      this.confirmText = 'Are you sure you want to delete the table(s)?';
    } else if (action === 'ADD') {
      this.getAllTables();
      this.confirmFn = this.addTables;
      this.confirmText = 'Are you sure you want to add the table(s)?';
    } 
  }

  public checkUniqueName(obj, type,data?, index?) {
    if(obj.table_name == ''){
      this.toasterService.error("Please enter name.");
    }else if (obj.old_val == obj.table_name) {
      this.toasterService.error("Please enter a new name.");
    } else {
      if(type === 'table'){
        this.semanticService.myMethod$.subscribe(columns => {    
          this.columns = Array.isArray(columns) ? columns : [];
        });
        if (this.columns.find(ele => (ele.mapped_table_name === obj.table_name))) {
          this.toasterService.error("This Table name already exists.")
        } else {
          this.renameTable(obj,'table',data);
        }
      }else if(type == 'column'){

        if (data.mapped_column_name.find(ele => (ele === obj.table_name))) {
          this.toasterService.error("This Table name already exists.")
        } else {
          this.renameTable(obj,'column',data,index);
        }
      }else{
        this.objectExplorerSidebarService.checkUnique().subscribe(
          res => {
            this.semList = res['existing_sl_list'];
            if (this.semList.find(s => (s === obj.table_name))) {
              this.toasterService.error("This Semantic layer name already exists.")
            } else {
              this.renameTable(obj, "semantic");
            }
          })
      }
     
    }
  }
  public searchTableList(key,type) {
    let results = [];
      if(type == "custom"){
        if(key) {
          results = JSON.parse(JSON.stringify(this.customData)).filter(ele => {
          if (ele.custom_table_name.toLowerCase().match(key.toLowerCase())) {
            return ele;
          } else {
              if(ele.mapped_column_name){
                ele.mapped_column_name = ele.mapped_column_name.filter(data => {
                  return data.toLowerCase().match(key.toLowerCase());
                });
                if (ele.mapped_column_name.length != 0) {
                    return ele;
                }
              }  
            }
          });
        } else {
          results = JSON.parse(JSON.stringify(this.customData));
        }
        this.views = results;
      }else{
        if(key){
        results = JSON.parse(JSON.stringify(this.originalTables)).filter(ele => {
          if (ele.mapped_table_name.toLowerCase().match(key.toLowerCase())) {
            return ele;
          } else {
            ele.mapped_column_name = ele.mapped_column_name.filter(data => {
              return data.toLowerCase().match(key.toLowerCase());
            });
            if (ele.mapped_column_name.length != 0) {
              return ele;
            }
          }
        });
      } else {
        results = JSON.parse(JSON.stringify(this.originalTables));
      }
      this.columns = results;
      }    
  }
  public resetSelection() {
    Utils.hideSpinner();
    Utils.closeModals();
    this.getSemanticLayerTables();
    this.selectedTables = [];
    this.tables = [];
    this.views=[];
  }

  public getSearchInput(e) {
    let inputFocus;
    this.isCollapsed = !this.isCollapsed;

    if (!this.isCollapsed) {
      this.columns = JSON.parse(JSON.stringify(this.originalTables));
    } else {
      setTimeout(() => {
        inputFocus = document.querySelectorAll("input#tableIdSearch");
        inputFocus[0].style.display = 'block';
        inputFocus[0].focus();
      });
    }
  };

  public getCustomSearchInput(e) {
    let inputFocus;
    this.EnableCustomSearch = !this.EnableCustomSearch;

    if (!this.EnableCustomSearch) {
      this.views = JSON.parse(JSON.stringify(this.customData));
    } else {
      setTimeout(() => {
        inputFocus = document.querySelectorAll("input#customtableIdSearch");
        inputFocus[0].style.display = 'block';
        inputFocus[0].focus();
      });
    }
  };
  public navigateSQLBuilder(){
    this.route.navigate(['semantic/query-builder']);
  };

  /**
   * getRelatedTables
   */
  public getRelatedTables(id: number) {
    this.toggleService.setSpinner(true);
    this.reportsService.getTables(id).subscribe(
      res => {
        this.relatedTables = res['table_data'];
        this.toggleService.setSpinner(false);
        this.toggleService.setValue(this.relatedTables);
        this.toggleService.setOriginalValue(this.relatedTables);
      },
      err => {
        this.relatedTables = [];
        this.toggleService.setSpinner(false);
        this.toggleService.setValue(this.relatedTables);
        this.toggleService.setOriginalValue(this.relatedTables);
      }
    );
    this.toggleService.setToggle(true);
  }

  public deleteSemanticLayer(){
    this.confirmText = 'Are you sure you want to delete the semantic layer?';
    this.confirmFn = function(){
      let data = {
        sl_id: this.semanticId, 
        sl_name: this.semantic_name
      }

      Utils.showSpinner();
      this.objectExplorerSidebarService.deleteSemanticLayer(data).subscribe(response => {
        this.toasterService.success(response['message'])      
        Utils.hideSpinner();
        Utils.closeModals();
        this.route.navigate(['module']); 
      }, error => {
        this.toasterService.error(error.message['error'] || this.defaultError);
        Utils.hideSpinner();
        Utils.closeModals();
      });
    };
  }

}