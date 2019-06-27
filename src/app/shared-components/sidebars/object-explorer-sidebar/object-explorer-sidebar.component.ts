import { Component, OnInit, ViewChildren, QueryList, ViewChild } from "@angular/core";
import * as $ from "jquery";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SemdetailsService } from "../../../semdetails.service";
import { AuthenticationService } from "../../../authentication.service";
import { ObjectExplorerSidebarService } from "./object-explorer-sidebar.service";
import { ReportsService } from "../../../reports/reports.service";
import { SidebarToggleService } from "../sidebar-toggle.service";
import Utils from "../../../../utils";
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CreateCalculatedColumnComponent } from '../../../create-report/create-calculated-column/create-calculated-column.component';
import { InlineEditComponent } from '../../inline-edit/inline-edit.component';
@Component({
  selector: "app-object-explorer-sidebar",
  templateUrl: "./object-explorer-sidebar.component.html",
  styleUrls: ["./object-explorer-sidebar.component.css"]
})

export class ObjectExplorerSidebarComponent implements OnInit {

  public columns = [];
  public slTables;
  public button;
  public semList;
  public value;
  public isButton;
  public isShow = false;
  public Show = false;
  public semantic_name;
  public isCollapsed = false;
  public EnableCustomSearch = false;
  public isLoading: boolean;
  public Loading: boolean;
  public loader: boolean;
  public isLoad: boolean;
  public userid;
  public semanticNewList;
  public originalTables;
  public selSemantic;
  public dependentReports = [];
  public tables = [];
  public action: string = '';
  public isCustomTable: boolean;
  public selectedTables = [];
  public confirmFn;
  public confirmText: string = '';
  public confirmHeader: string = '';
  public semanticId: number; views; customData; arr; roles; roleName; sidebarFlag; errorMsg; info; properties;
  public values;
  public relatedTables;
  public isMultiColumn:boolean = false;
  public selectsel;
  public sele;
  public semanticNames;
  public sls;
  public sel;
  public slName;
  public semanticList;
  public schema:string;
  public routeValue: boolean = false;
  public userRole;
  customNoData = {'calculated': [],'query':[]}
  defaultError = "There seems to be an error. Please try again later.";

  selectedTable:any;
  isLoadingTables: boolean;
  isLoadingViews: boolean;

  @ViewChildren("renameTable") renameTables: QueryList<InlineEditComponent>;
  @ViewChildren("renameColumn") renameColumns: QueryList<InlineEditComponent>;
  @ViewChildren("renameCustom") renameCustoms: QueryList<InlineEditComponent>;
  @ViewChild("renameSemantic") renameSem: InlineEditComponent;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private user: AuthenticationService,
    private objectExplorerSidebarService: ObjectExplorerSidebarService,
    private semanticService: SemdetailsService,
    private toasterService: ToastrService,
    private reportsService: ReportsService,
    private toggleService: SidebarToggleService,
    private dialog: MatDialog) {

      this.user.myMethod$.subscribe(role =>{
        if (role) {
          this.userRole = role["role"];
        }
      })

    this.objectExplorerSidebarService.getTables.subscribe(columns => {
      this.columns = Array.isArray(columns) ? columns : [];
      this.originalTables = JSON.parse(JSON.stringify(this.columns));
    });

    this.objectExplorerSidebarService.getCustomTables.subscribe((views) => {
      this.views = views || [];
      this.checkViews();
      this.customData = JSON.parse(JSON.stringify(views));
    })
    this.user.myMethod$.subscribe((arr) => {
      this.arr = arr;
      this.roles= {'first_name': this.arr.first_name,'last_name' : this.arr.last_name,'role_id': this.arr.role_id};
      this.roleName = {'role':this.arr.role};
    });

    this.user.button$.subscribe((isButton) => this.isButton = isButton )
    this.sidebarFlag = 1;    
  }

  ngOnInit() {
    this.schema = this.user.getSchema();
    this.route.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
    this.selectSl();
    this.objectExplorerSidebarService.getName.subscribe((semanticName) => {this.semantic_name = semanticName});
    $(document).ready(function () {
      $("#sidebarCollapse").on("click", function () {
        $("#sidebar").toggleClass("active");
      });
    });
    this.user.errorMethod$.subscribe((userid) =>
      this.userid = userid);
    this.user.fun(this.userid).subscribe(res => {
      this.semanticList = res["sls"];
      this.semanticNames = this.semanticList.sort(function(a,b){
        a = a.sl_name.toLowerCase();
        b = b.sl_name.toLowerCase();
      return (a< b) ? -1 : (a > b) ? 1 : 0;
      });
    });
    this.user.sl$.subscribe(res => {
      if (res == undefined) {
        return
      } else {
        this.semanticNames = res.sort(function (a, b) {
          a = a.sl_name.toLowerCase();
          b = b.sl_name.toLowerCase();
          return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
      }
    });

  this.collapseObjectExplorer();
  }

  collapseObjectExplorer() {
    this.route.events.subscribe( val =>{
      if(val instanceof NavigationEnd){
        let routeList = val['url'].split('/');
        if(val['url'] === '/semantic/sem-reports/view/insert/'+routeList[routeList.length-1]){
          $("#sidebar").addClass('d-none');
          $("#sidebarCollapse").addClass('d-none');
        }else{
          $("#sidebar").removeClass('d-none');
          $("#sidebarCollapse").removeClass('d-none');
        }
      }
    })
  }
  

  showtables(i) {
    this.button = i;
    this.isShow = !this.isShow;
  }

  selectSl() {
    this.objectExplorerSidebarService.getValue.subscribe((semanticValue) =>  {this.value = semanticValue });
    if(this.value != 1) {
      this.isButton = false;
    } else {
      this.isButton = true;
      this.user.button(this.isButton);
    }
  }

  public toggle() {
    $("#sidebar").toggleClass("active");
    this.toggleService.setToggle(false);
  }

  public userVisibility() {
    this.isLoad = true;
    this.selSemantic = this.semanticId ;
    this.semanticService.fetchsem(this.selSemantic).subscribe(res => {
      this.slTables = res;
      this.isLoad = false;
    })
  }

  public changeView(event) {
    let options = {};
    Utils.showSpinner();
    options['visible_tables'] = event.visible_tables;
    options['hidden_tables'] = event.hidden_tables;
    this.objectExplorerSidebarService.updateView(options).subscribe(
      res => {
        this.toasterService.success("Visibility to Users Updated")
        Utils.hideSpinner();
        Utils.closeModals();
        this.selectsel = this.semanticId;
        this.semanticService.fetchsem(this.selectsel).subscribe(res => {
          this.columns = res["data"]["sl_table"];
          this.objectExplorerSidebarService.setTables(this.columns);
        })
      },
      err => {
        this.toasterService.error(err.message || this.defaultError);
      }
    );
  };

  public renameTable(obj, type, data?, index?) {
    let options = {};
    Utils.showSpinner();
    options["table_id"] = obj.table_id;
    options["sl_id"] = this.semanticId;
    if (type == "column") {
      options["old_column_name"] = obj.old_val;
      options["new_column_name"] = obj.table_name;
      this.objectExplorerSidebarService.saveColumnName(options).subscribe(
        res => {
          this.refreshPage();
          this.toasterService.success("Column has been renamed successfully");
          data.mapped_column_name[index] = obj.table_name;
          data.column_properties[index].column = obj.table_name;
          Utils.hideSpinner();
          this.objectExplorerSidebarService.setTables(this.columns);
          this.renameColumns["_results"][index].isReadOnly = true;
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
          Utils.hideSpinner();
          this.renameColumns["_results"][index].isReadOnly = true;
        }
      );
    } else if (type == "semantic") {
      this.route.config.forEach(element => {
        if (element.path == "semantic") {
          this.semanticId = element.data["semantic_id"];
        }
      });
      options["slId"] = this.semanticId;
      options["old_semantic_layer"] = obj.old_val;
      options["new_semantic_layer"] = obj.table_name;
      this.objectExplorerSidebarService.updateSemanticName(options).subscribe(
        res => {
          this.semantic_name = obj.table_name;
          this.activatedRoute.snapshot.data["semantic"] = obj.table_name;
          this.user.fun(this.userid).subscribe(res => {
            this.semanticNames = res["sls"];
          })
          this.objectExplorerSidebarService.setSlList(this.semanticNames);
          this.objectExplorerSidebarService.setName(this.semantic_name);
          this.objectExplorerSidebarService.getSlList.subscribe(semanticNames => this.semanticNames = semanticNames  );
          Utils.hideSpinner();
          this.toasterService.success("Semantic Layer has been renamed successfully");
          this.renameSem["_results"].isReadOnly = true;
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
          Utils.hideSpinner();
          this.renameSem["_results"].isReadOnly = false;
        }
      );
    }
    else {
      options["table_name"] = obj.table_name;
      this.objectExplorerSidebarService.saveTableName(options).subscribe(
        res => {
          this.refreshPage();
          this.toasterService.success("Table has been renamed successfully");
          data.mapped_table_name = obj.table_name;
        //   this.user.fun(this.userid).subscribe(res => {
        //   this.semanticNames = res["sls"];
        // } );
          Utils.hideSpinner();
          this.renameTables["_results"][index].isReadOnly = true;
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
          Utils.hideSpinner();
          this.renameTables["_results"][index].isReadOnly = false;
        }
      );
    }
  }
  public renameCustomTable(obj,i) {
    let options = {}, result;
    options["custom_table_id"] = obj.table_id;
    options["custom_table_name"] = obj.table_name;
    options["custom_table_name"] = obj.table_name;
    if (obj.table_name !== "") {
      result = JSON.parse(JSON.stringify(this.views)).filter(ele => {
        if (ele.custom_table_name.toLowerCase() == obj.table_name.toLowerCase()) {
          return ele;
        }
      });
    }
    if (obj.old_val.toLowerCase() === obj.table_name.toLowerCase()) {
      document.getElementById(obj.table_id)["value"] = obj.old_val;
      this.toasterService.error("Please enter a new name");
    } else if (obj.table_name === '') {
      document.getElementById(obj.table_id)["value"] = obj.old_val;
      this.toasterService.error("Table name can't be empty");
    } else if (result.length > 0) {
      document.getElementById(obj.table_id)["value"] = obj.old_val;
      this.toasterService.error("Table name already exists");
    } else {
      this.objectExplorerSidebarService.saveCustomTableName(options).subscribe(
        res => {
          this.refreshPage();
          this.toasterService.success("Table rename has been changed successfully");
          this.views = this.views.filter(ele => {
            if (ele.custom_table_id == obj.table_id) {
              ele.custom_table_name = obj.table_name;
            }
            return ele;
          })
          Utils.hideSpinner();
          this.renameCustoms['_results'][i].isReadOnly = true;
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
          Utils.hideSpinner();
          this.renameCustoms['_results'][i].isReadOnly = false;
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
    this.isCustomTable = false;
    this.selectedTables = [];
    this.selectedTables.push(tableId);
    this.confirmFn = this.deleteTables;
    this.confirmHeader = 'Delete table';
    this.confirmText = 'Are you sure you want to delete the table(s)?';
    this.objectExplorerSidebarService.getReports(tableId).subscribe(response => {
      this.dependentReports = response['data'];
      this.isLoading = false;
    }, error => {
      this.dependentReports = [];
      this.toasterService.error(error.message || this.defaultError);
    })
  }

  public removeCustomTable(tableId: number) {
    this.isCustomTable = true;
    this.isLoading = true;
    this.selectedTables = [];
    this.selectedTables.push(tableId);
    this.confirmHeader = 'Delete custom table';
    this.confirmText = 'Are you sure you want to delete the table(s)?';
    this.confirmFn = function () {
      Utils.showSpinner();
      this.deleteTables(response => {
        this.toasterService.success(response['message'])
        Utils.hideSpinner();
        Utils.closeModals();
        this.getCustomTables();
      }, error => {
        this.toasterService.error(error.message['error'] || this.defaultError);
        Utils.hideSpinner();
        Utils.closeModals();
        this.getCustomTables();
      });
    };
  }

  public setSelectedTables(tables: any[]) {
    switch(this.action){
      case 'ADD': 
        this.selectedTables = tables.map(t => t['table_name']);
        break;
      case 'REMOVE':
        this.selectedTables = tables.map(t => t['sl_tables_id']);
        break;
      case 'REMOVECUSTOM':
        this.selectedTables = tables.map(t => t['custom_table_id']);
        break;
      default:
        this.selectedTables = [];
    }
  }

  public listofvalues(column, table_id) {
    this.Loading = true;
    let options = {};
    options["slId"] = this.semanticId;
    options['columnName'] = column;
    options['tableId'] = table_id;
    this.objectExplorerSidebarService.listValues(options).subscribe(res => {
      this.values = res;      
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

    if (!this.isCustomTable) {
      this.objectExplorerSidebarService.deleteTables(this.selectedTables).subscribe(response => {
        this.refreshPage();
        this.toasterService.success(response['message'])
        this.resetSelection();
      }, error => {
        this.toasterService.error(error.message['error'] || this.defaultError);
        this.resetSelection();
      });
    }
    else {
      this.objectExplorerSidebarService.deleteCustomTables(this.selectedTables).subscribe(response => {
        this.refreshPage();
        this.toasterService.success(response['message'])
        this.resetSelection();
      }, error => {
        this.toasterService.error(error.message['error'] || this.defaultError);
        this.resetSelection();
      });
    }
  }

  public deleteColumn(tableData: any, index: number) {
    this.confirmHeader = 'Delete column';
    this.confirmText = "Are you sure you want to delete the column?";
    this.confirmFn = function () {
      let data = {
        "sl_id": this.semanticId,
        "sl_tables_id": tableData.sl_tables_id,
        "column_name": tableData.mapped_column_name[index]
      };
      Utils.showSpinner();
      this.objectExplorerSidebarService.deleteColumn(data).subscribe(
        res => {
          this.refreshPage();
          this.toasterService.success("Column removed sucessfully");
          this.resetSelection();
          // Utils.hideSpinner();
          // Utils.closeModals();
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
          Utils.hideSpinner();
          Utils.closeModals();
          // this.resetSelection();
        }
      );
    }
  }

  public addTables() {
    let data = {
      sl_id: this.semanticId,
      tables: this.selectedTables
    }
    Utils.showSpinner();
    this.objectExplorerSidebarService.addTables(data).subscribe(response => {
      this.toasterService.success(response['message']);
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
      this.tables = response['data']['sl_table'].filter(table => table['view_to_admins']);
      this.objectExplorerSidebarService.setTables(this.columns);
      this.isLoading = false;
      this.isLoadingTables = false;
    }, error => {
      this.tables = [];
      this.toasterService.error(error.message || this.defaultError);
      Utils.closeModals();
      this.isLoadingTables = false;
    })
  }

  public getAllTables() {
    this.isLoading = true;
    this.selectedTables = [];
    this.objectExplorerSidebarService.getAllTables(this.semanticId).subscribe(response => {
      this.tables = response['data'];
      this.isLoading = false;
    }, error => {
      this.tables = [];
      this.toasterService.error(error['message'].error || this.defaultError);
      Utils.closeModals();
    })
  }

  public setAction(action: string) {
    this.action = action;
    this.tables = [];
    this.selectedTables = [];
    this.isCustomTable = (action === 'REMOVECUSTOM') ? true : false;
    if (action === 'REMOVE' || action === 'REMOVECUSTOM') {
      this.views.forEach(element => {
        element.checked = false 
      });
      this.getSemanticLayerTables();
      this.confirmFn = this.deleteTables;
      this.confirmHeader = (action === 'REMOVE') ? 'Delete tables' : 'Delete custom tables';
      this.confirmText = 'Are you sure you want to delete the table(s)?';
    } else if (action === 'ADD') {
      this.getAllTables();
      this.confirmFn = this.addTables;
      this.confirmHeader = 'Add tables';
      this.confirmText = 'Are you sure you want to add the table(s)?';
    }
  }

  public checkUniqueName(obj, type?, data?, index?) {
    if (!obj.table_name) {
      this.toasterService.error("Please enter name.");
    } else if (obj.old_val == obj.table_name) {
      this.toasterService.error("Please enter a new name.");
      // this.readOnly = false;
    } else {
      if (type === 'table') {
        this.objectExplorerSidebarService.getTables.subscribe(columns => {
          this.columns = Array.isArray(columns) ? columns : [];
        });
        if (this.columns.find(ele => (ele.mapped_table_name === obj.table_name))) {
          this.toasterService.error("This Table name already exists.")
        } else {
          this.renameTable(obj, 'table', data, index);
        }
      } else if (type == 'column') {

        if (data.mapped_column_name.find(ele => (ele === obj.table_name))) {
          this.toasterService.error("This Table name already exists.")
        } else {
          this.renameTable(obj, 'column', data, index);
        }
      } else {
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
  
  public searchTableList(key, type) {
    let results = [];
    if (type == "custom") {
      if (key) {
        results = JSON.parse(JSON.stringify(this.customData)).filter(ele => {
          if (ele.custom_table_name.toLowerCase().indexOf(key.toLowerCase()) > -1) {
            return ele;
          } else {
            if (ele.mapped_column_name) {
              ele.mapped_column_name = ele.mapped_column_name.filter(data => {
                if(data.toLowerCase().indexOf(key.toLowerCase()) > -1)
                  return data;
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
    } else {
      let isColumnSearched = false;
      if (key) {
        results = JSON.parse(JSON.stringify(this.originalTables)).filter(ele => {
          if (ele.mapped_table_name.toLowerCase().indexOf(key.toLowerCase()) > -1) {
            return ele;
          } else {
            ele.mapped_column_name = ele.mapped_column_name.filter(data => {
              if( data.toLowerCase().indexOf(key.toLowerCase()) > -1)
                return data;
            });
            if (ele.mapped_column_name.length != 0) {
              isColumnSearched = true;
              return ele;
            }
          }
        });
      } else {
        results = JSON.parse(JSON.stringify(this.originalTables));
      }
      this.columns = results;
      if(isColumnSearched){
        // this.showtables(0,'search');
        this.button = 0;
        this.isShow = true;
      }else {
        this.button = 0;
        this.isShow = false;
      }
    }
  }
  
  public resetSelection() {
    Utils.hideSpinner();
    Utils.closeModals();
    if(!this.isCustomTable) {
      this.isLoadingTables = true;
      this.getSemanticLayerTables();
      this.tables = [];
    }
    this.selectedTables = [];
    if(this.isCustomTable) {
      this.isLoadingViews = true;
      this.getCustomTables();
    }
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
  
  public navigateSQLBuilder(obj?){
    this.route.navigate(['semantic/sem-sl/query-builder']);
    this.routeValue = true;
    this.user.setSlRoute(this.routeValue);
    if(!obj){
      obj = {};
      obj.custom_table_query = "";
      obj.custom_table_name = "";
      obj.custom_table_id = "";
    }
    if(this.route.url === '/semantic/sem-sl/query-builder'){
      this.objectExplorerSidebarService.setCustomQuery(obj)
    }else{
      setTimeout(() => {
        this.objectExplorerSidebarService.setCustomQuery(obj)     
      }, 300);
    }
   
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

  public deleteSemanticLayer() {
    this.confirmText = 'This deletion will affect all the user who has privilege to this particular semantic layer. Are you sure want to delete it?';
    this.confirmHeader = 'Delete semantic layer';
    this.confirmFn = function () {
      let data = {
        sl_id: this.semanticId,
        sl_name: this.semantic_name
      }
      Utils.showSpinner();
      this.objectExplorerSidebarService.deleteSemanticLayer(data).subscribe(response => {
        this.toasterService.success(response['message']);
        this.objectExplorerSidebarService.setName("");
        let value = 0;
        this.objectExplorerSidebarService.setValue(value);
        this.objectExplorerSidebarService.setTables([]);
        this.objectExplorerSidebarService.setCustomTables([]);
        Utils.hideSpinner();
        Utils.closeModals();
        this.route.navigate(['user']);
        
      }, error => {
        this.toasterService.error(error.message['error'] || this.defaultError);
        Utils.hideSpinner();
        Utils.closeModals();
      });
    };
  }

  public getCustomTables() {
    this.semanticService.getviews(this.semanticId).subscribe(response => {
      this.views = response['data']['sl_view'];
      this.objectExplorerSidebarService.setCustomTables(this.views);
      this.isLoadingViews = false;
      this.checkViews();
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
      this.isLoadingViews = false;
    })
  }

  public validateTableName(table: string) {
    table = table.trim().toUpperCase();
    let tables = this.columns.map(col => col['mapped_table_name'].toUpperCase());
    let customTables = this.views.map(view => view['custom_table_name'].toUpperCase());

    if (tables.includes(table)) {
      this.toasterService.error('Table name cannot be an existing table name');
      return false;
    }
    else if (customTables.includes(table)) {
      this.toasterService.error('Table name cannot be an existing custom table name');
      return false;
    }
    return true;
  }

  public createCalculatedColumn(data: any) {
    data.sl_id = this.semanticId;
    // if (!this.isMultiColumn && !this.validateTableName(data.custom_table_name)) return;


    Utils.showSpinner();
    this.objectExplorerSidebarService.addColumn(data).subscribe(response => {
      this.toasterService.success('Added calculated column successfully');
      Utils.hideSpinner();
      Utils.closeModals();
      this.getCustomTables();
    }, error => {
      this.toasterService.error(error.message['error']);
      Utils.hideSpinner();
    });
  }

  public fun(event: any) {
    this.user.button(this.isButton);
    let value = 1;
    this.objectExplorerSidebarService.setValue(value);
    this.sel = event.target.value;
    if(this.sel == "" ) {
      return;
    } else {
    this.sls = this.semanticNames.find(x => 
      x.sl_name.trim().toLowerCase() == this.sel.trim().toLowerCase()
    ).sl_id;
    this.route.config.forEach(element => {
      if (element.path == "semantic") {
        element.data["semantic"] = this.sel;
        element.data["semantic_id"] = this.sls;
      }
    });
    this.activatedRoute.snapshot.data["semantic"] = this.sel;
    this.sele = this.sel;
    this.objectExplorerSidebarService.setName(this.sel);
    this.semanticService.fetchsem(this.sls).subscribe(res => { 
      this.columns = res["data"]["sl_table"];
        this.objectExplorerSidebarService.setTables(this.columns);
        this.semantic_name = this.sel;
        this.semanticId = this.sls;
        this.isButton = true;
    });
    this.semanticService.getviews(this.sls).subscribe(res => {
      this.views = res["data"]["sl_view"];
      this.checkViews();
      this.objectExplorerSidebarService.setCustomTables(this.views);
    });
  }
  };

  public checkSl(event) {
    this.isButton = true;
    this.user.button(this.isButton);
    this.route.navigateByUrl('/semantic/sem-reports/home');
  }

  refreshPage() {
    let urls = this.route.url.split('/');
    if(this.route.url === '/semantic/sem-reports/home'){
      this.objectExplorerSidebarService.isRefresh('reportList');
    }
  }

  checkViews() {
    this.customNoData.calculated = this.views.filter(data => {
      return data.view_type;
    })
    this.customNoData.query = this.views.filter(data => {
      return !data.view_type;
    })
  }

}