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
// import { CreateRelationComponent } from '../../../relations/create-relation/create-relation.component';
import { ShowRelationsComponent } from '../../../relations/show-relations/show-relations.component';
import { ConditionModalWrapperComponent } from 'src/app/condition-modal/condition-modal-wrapper/condition-modal-wrapper.component';
import { ParametersContainerComponent } from 'src/app/parameters-modal/parameters-container/parameters-container.component';
import { CalculatedColumnComponent } from '../../../calculated-column/calculated-column.component';
import { RelationLayoutComponent } from '../../../relations/relation-layout/relation-layout.component';
import { SharedDataService } from '../../../create-report/shared-data.service';
import { constants_value } from '../../../constants';
@Component({
  selector: "app-object-explorer-sidebar",
  templateUrl: "./object-explorer-sidebar.component.html",
  styleUrls: ["./object-explorer-sidebar.component.css"]
})

export class ObjectExplorerSidebarComponent implements OnInit {

  public columns = [];
  public slTables;
  public button;
  public selectedCustomId;
  public type;
  public defaultValue;
  public selectedValue;
  public selectedColumn;
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
  public duplicateTables;
  public duplicateTablesCustom;
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
  public receiveDescription;
  public sel;
  public sendSl;
  public slName;
  public semanticList;
  public schema:string;
  public routeValue: boolean = false;
  public userRole;
  public description;
  public editDescriptionValue;

  public favoriteTables : any =[];
  public nonFavoriteTablesIds : any =[];
  public showSubmitFavorites: boolean = false;
  public disableSubmitFavorites: boolean = false;
  public finalFavNonFavTables : any = [];
  public disableStars :boolean = true;
  public tableId:any;

  public favoriteTablesCustom : any =[];
  public nonFavoriteTablesIdsCustom : any =[];
  public showSubmitFavoritesCustom : boolean = false;
  public disableSubmitFavoritesCustom = false;
  public disableStarsCustom = true;
  public finalFavNonFavTablesCustom : any = [];
  public visibilityObject = {}
  public viewsCopy = [];

  public table_selected : any ;

  customNoData = {'calculated': [],'query':[]}
  defaultError = "There seems to be an error. Please try again later.";

  selectedTable:any;
  isLoadingTables: boolean = true;
  isLoadingViews: boolean = true;
  

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
    private dialog: MatDialog,
    private sharedDataService:SharedDataService) {

      this.user.myMethod$.subscribe(role =>{
        if (role) {
          this.userRole = role["role"];
        }
      })

      this.getSortedTables();
      this.getSortedViews();

    this.user.myMethod$.subscribe((arr) => {
      this.arr = arr;
      this.roles= {'first_name': this.arr.first_name,'last_name' : this.arr.last_name,'role_id': this.arr.role_id};
      // console.log("Checking the roles here : ",this.roles);
      
      this.roleName = {'role':this.arr.role};
    });

    this.user.button$.subscribe((isButton) => this.isButton = isButton )
    this.sidebarFlag = 1;    
  }

  public getSortedTables(){
    this.finalFavNonFavTables = [];
    this.objectExplorerSidebarService.getTables.subscribe(columns => {
      if(columns){

      this.columns = Array.isArray(columns) ? columns : [];
      this.originalTables = JSON.parse(JSON.stringify(this.columns));
      this.columns.sort(function (a, b) {
        a = a.mapped_table_name.toLowerCase();
        b = b.mapped_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      });
      this.duplicateTables = this.columns;
      // console.log("Duplicate tables values : ",this.duplicateTables)

      let favTab = this.columns.filter(i=>i.is_favourite)
      let favTabSorted = favTab.sort(function (a, b) {
        a = a.mapped_table_name.toLowerCase();
        b = b.mapped_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }); 
      let nonFavTab = this.columns.filter(i=>i.is_favourite === false)
      let nonFavTabSorted = nonFavTab.sort(function (a, b) {
        a = a.mapped_table_name.toLowerCase();
        b = b.mapped_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }); 
      let favTabSortedCopy = favTabSorted
      Array.prototype.push.apply(favTabSortedCopy,nonFavTabSorted)
      this.finalFavNonFavTables = favTabSortedCopy;
      // check here
      this.favoriteTables = [];
      this.finalFavNonFavTables.map(i=>{
        if(i.is_favourite) this.favoriteTables.push(i.sl_tables_id);
      })
      // console.log("this.finalFavNonFavTables : ",this.finalFavNonFavTables)
      // console.log("this.favoriteTablesCustom IDS CUSTOM : ",this.favoriteTables)
      this.columns = this.finalFavNonFavTables;
      this.disableStars = true;
      this.isLoadingTables = false;

      // console.log("TABLES after sorted: !!!",this.columns);
    }
    });
  }

  public getSortedViews(){
    this.views = [];
    this.objectExplorerSidebarService.getCustomTables.subscribe((views) => {
      if(views){
      this.views = views || [];

      // console.log("VIEWS(CT) being obtained: !!!",this.views);
      // this.duplicateTablesCustom = this.views;
      
      this.checkViews();
      this.customData = JSON.parse(JSON.stringify(views));

      this.duplicateTablesCustom = this.views;
      this.views.sort(function (a, b) {
        a = a.custom_table_name.toLowerCase();
        b = b.custom_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      });
      this.duplicateTablesCustom = this.views;
      // console.log("Duplicate tables values : ",this.duplicateTablesCustom)

      let favTab = this.views.filter(i=>i.is_favourite)
      let favTabSorted = favTab.sort(function (a, b) {
        a = a.custom_table_name.toLowerCase();
        b = b.custom_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }); 
      let nonFavTab = this.views.filter(i=>i.is_favourite === false)
      let nonFavTabSorted = nonFavTab.sort(function (a, b) {
        a = a.custom_table_name.toLowerCase();
        b = b.custom_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }); 
      let favTabSortedCopy = favTabSorted
      Array.prototype.push.apply(favTabSortedCopy,nonFavTabSorted)
      this.finalFavNonFavTablesCustom = favTabSortedCopy;
      this.favoriteTablesCustom = [];
      this.finalFavNonFavTablesCustom.map(i=>{
        if(i.is_favourite) this.favoriteTablesCustom.push(i.custom_table_id);
      })

      // console.log("this.finalFavNonFavTablesCustom : ",this.finalFavNonFavTablesCustom)
      // console.log("this.favoriteTablesCustom IDS CUSTOM : ",this.favoriteTablesCustom)

      this.views = this.finalFavNonFavTablesCustom;
      this.disableStarsCustom = true;
      this.isLoadingViews = false;
      // console.log("VIEWS after sorted: !!!",this.views);

    }
    })
  }
  
  ngOnInit() {
    this.schema = this.user.getSchema();
    this.route.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
    this.selectSl();
    this.objectExplorerSidebarService.getName.subscribe((semanticName) => {
      this.semantic_name = semanticName; 
      if(this.semantic_name == "") {
        this.defaultValue = 'Choose a Semantic Layer';
      } else {
        this.defaultValue = this.semantic_name;
      }
    });
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
          return  (a < b) ? -1 : (a > b) ? 1 : 0;
        });
      }
    });

  this.collapseObjectExplorer();
  this.getSortedTablesRefresh();
  // this.getSortedViewsRefresh();
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

  public userVisibility(type:string) {
    this.isLoad = true;
    this.selSemantic = this.semanticId ;
    // for normal tables
    if(type == "tables"){
      this.semanticService.fetchsem(this.selSemantic).subscribe(res => {
        this.slTables = res;
        this.visibilityObject = { 'type' : type , obtainedTables : this.slTables }
        // console.log("Checking the slTables values for TABLES :",this.slTables);
        this.isLoad = false;
      })
    }
    else{
      // this.slTables = this.views;  
      this.objectExplorerSidebarService.getCustomTables.subscribe((results) => {
        this.slTables = results;
        this.visibilityObject = { 'type' : type , obtainedTables : this.slTables }
        // console.log("Checking the slTables values for CUSTOM TABLES :",this.slTables);
        this.isLoad = false;
      })
    }
  }

  public changeView(event) {
    let options = {};
    Utils.showSpinner();
    options['visible_tables'] = event.visible_tables;
    options['hidden_tables'] = event.hidden_tables;
    // options['columns_visibility_update'] = event.columns_visibility_update;
    options['type'] = event.type;

    // change here wrt CUSTOM TABLES
    if(options['type'] == 'tables'){
      options['columns_visibility_update'] = event.columns_visibility_update;
      this.objectExplorerSidebarService.updateView(options).subscribe(
        res => {
          this.toasterService.success("Visibility to Users Updated")
          Utils.hideSpinner();
          Utils.closeModals();
          this.selectsel = this.semanticId;
          this.semanticService.fetchsem(this.selectsel).subscribe(res => {
            this.columns = res["data"]["sl_table"];
            this.getSortedTablesRefresh();
            this.objectExplorerSidebarService.setTables(this.columns);
          })
          // this.getSortedTablesRefresh();
        },
        err => {
          this.toasterService.error(err.message || this.defaultError);
          this.getSortedTablesRefresh();
          this.objectExplorerSidebarService.setTables(this.columns);
        }
      );
    }
    else if(options['type'] == 'custom tables'){
      // CUSTOM TABLES updation API 
      // send only the below value:: to the new API, other values not needed,discussed with Baby Kumar
      options['custom_visibility_update'] = event.custom_visibility_update;
      // console.log("CALLED the custom tables updation api,DATAOBJECT : ",options);

      // updateCustomTablesVisibility
      this.objectExplorerSidebarService.updateCustomTablesVisibility(options).subscribe(
        res => {
          this.toasterService.success("Visibility to Users Updated")
          Utils.hideSpinner();
          Utils.closeModals();
          this.selectsel = this.semanticId;
          this.semanticService.getviews(this.selectsel).subscribe(res => {
            this.views = res["data"]["sl_view"];
            // console.log("Entering the new custom table values : ",this.views);
            // this.viewsCopy = [...this.views]
            // this.objectExplorerSidebarService.setCustomTablesForVisibilty(this.viewsCopy); //for VISIBILITY 
            // this.views = this.views.filter(i=> (i.view_to_admins == true))
            
            this.getSortedViewsRefresh();
            this.objectExplorerSidebarService.setCustomTables(this.views); //for OBJ-EXP
            // this.getSortedViewsRefresh();
          })
        },
        err => {
          this.toasterService.error(err.message || this.defaultError);
          this.getSortedViewsRefresh();
          this.objectExplorerSidebarService.setCustomTables(this.views); //for OBJ-EXP
        }
      );
      return; 
    }
  };


  public renameTable(obj, type, data?, index?) {
    let options = {};
    Utils.showSpinner();
    options["table_id"] = obj.table_id;
    options["sl_id"] = this.semanticId;
    if (type == "column") {
      options["old_column_name"] = obj.old_val;
      options["new_column_name"] = this.spaceValidator(obj.table_name);
      this.objectExplorerSidebarService.saveColumnName(options).subscribe(
        res => {
          this.refreshPage();
          this.toasterService.success("Column has been renamed successfully");
          // data.mapped_column_name[index] = obj.table_name;
          // data.column_properties[index].column = obj.table_name;
          Utils.hideSpinner();
          // this.objectExplorerSidebarService.setTables(this.columns);
          // this.renameColumns["_results"][index].isReadOnly = true;
          this.getSemanticLayerTables();
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
      options["table_name"] = this.spaceValidator(obj.table_name);
      this.objectExplorerSidebarService.saveTableName(options).subscribe(
        res => {
          this.refreshPage();
          this.toasterService.success("Table has been renamed successfully");
          // data.mapped_table_name = obj.table_name;
        //   this.user.fun(this.userid).subscribe(res => {
        //   this.semanticNames = res["sls"];
        // } );
          Utils.hideSpinner();
          this.getSemanticLayerTables();
          this.getSortedTablesRefresh();
          // this.renameTables["_results"][index].isReadOnly = true;
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
          Utils.hideSpinner();
          this.renameTables["_results"][index].isReadOnly = false;
          this.getSortedTablesRefresh();
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
          // console.log("LOGGING RESULTS because to checking  new API valurs : ",res);
          this.toasterService.success("Table rename has been changed successfully");
          this.views = this.views.filter(ele => {
            if (ele.custom_table_id == obj.table_id) {
              ele.custom_table_name = obj.table_name;
            }
            return ele;
          })
          Utils.hideSpinner();
          this.renameCustoms['_results'][i].isReadOnly = true;
          this.getSortedViewsRefresh();
        },
        err => {
          this.toasterService.error(err.message["error"] || this.defaultError);
          Utils.hideSpinner();
          this.renameCustoms['_results'][i].isReadOnly = false;
          this.getSortedViewsRefresh();
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
        this.refreshPage();
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

  public columnProperties(original_table_name, original_column_name) {
    this.loader = true;
    let options = {};
    options['original_table_name'] = original_table_name;
    options['original_column_name'] = original_column_name;
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
        this.getCustomTables();
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
        // "column_name": tableData.mapped_column_name[index]
        "column_name": tableData.column_properties[index].column       
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
      this.getSortedTablesRefresh();
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

        // if (data.mapped_column_name.find(ele => (ele === obj.table_name))) {
        if (data.column_properties.find(ele => (ele.column === obj.table_name))) {          
          this.toasterService.error("This Column name already exists.")
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
    key =  key?key.trim().replace(/\s+/g," ").replace(/\s/g,constants_value.column_space_replace_value):"";
    let results = [];
    if (type == "custom") {
      if (key) {
        results = JSON.parse(JSON.stringify(this.customData)).filter(ele => {
          if (ele.custom_table_name.toLowerCase().indexOf(key.toLowerCase()) > -1) {
            return ele;
          } else {
            // if (ele.mapped_column_name) {
            //   ele.mapped_column_name = ele.mapped_column_name.filter(data => {
            //     if(data.toLowerCase().indexOf(key.toLowerCase()) > -1)
            //       return data;
            //   });
            //   if (ele.mapped_column_name.length != 0) {
            //     return ele;
            //   }
            // }
            if (ele.column_properties) {
              ele.column_properties = ele.column_properties.filter(data => {
                if(data['column'].toLowerCase().indexOf(key.toLowerCase()) > -1)
                  return data;
              });
              if (ele.column_properties.length != 0) {
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
            // ele.mapped_column_name = ele.mapped_column_name.filter(data => {
            //   if( data.toLowerCase().indexOf(key.toLowerCase()) > -1)
            //     return data;
            // });
            // if (ele.mapped_column_name.length != 0) {
            //   isColumnSearched = true;
            //   return ele;
            // }
            ele.column_properties = ele.column_properties.filter(data => {
              if( data.column.toLowerCase().indexOf(key.toLowerCase()) > -1)
                return data;
            });
            if (ele.column_properties.length != 0) {
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
        this.objectExplorerSidebarService .setCustomTables([]);
        Utils.hideSpinner();
        Utils.closeModals();
        $("#custom-select").val('');
        this.isButton = false;
        this.user.button(this.isButton);
        this.route.navigate(['semantic']);
        this.user.errorMethod$.subscribe((userid) =>
        this.userid = userid);
        this.user.fun(this.userid).subscribe(res => {
          let semDetail = res["sls"];
          this.user.setSlMethod(semDetail);
        });
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
      // console.log("Checking Custom tables VALUES for VISBILTY:",this.views);
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

  public semanticLayerSelected(event?: any) { //removed because event?: any is not being used./refreshValue?:string
    this.user.button(this.isButton);
    let value = 1;
    this.isLoadingTables = true;
    this.isLoadingViews = true;
    this.objectExplorerSidebarService.setValue(value);
    // this.sharedDataService.setPristineRequestIdValue(true);
    // if(refreshValue){
    //   this.sel = refreshValue;
    // }
    // else{
      this.sel = this.selectedValue;
    // }
    if(this.sel == "" ) {
      return;
    } else {
      this.sls = this.semanticNames.find(x => 
        x.sl_name.trim().toLowerCase() == this.sel.trim().toLowerCase()
      ).sl_id;
      this.description = this.semanticNames.find(x => 
        x.sl_name.trim().toLowerCase() == this.sel.trim().toLowerCase()
      ).description;
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
        this.getSortedTablesRefresh();
        this.objectExplorerSidebarService.setTables(this.columns);
        this.isLoadingTables = false;
        this.semantic_name = this.sel;
        this.semanticId = this.sls;
        this.isButton = true;
    });
    
    this.semanticService.getviews(this.sls).subscribe(res => {
      this.views = res["data"]["sl_view"];
      this.checkViews();
      this.objectExplorerSidebarService.setCustomTables(this.views);
      this.isLoadingViews = false;
    });
  }
  // console.log(this.sel);
  // console.log(this.sls);
  
  
  };

  public checkSl(event){
    this.isButton = true;
    this.user.button(this.isButton);
    this.route.navigateByUrl('/semantic/sem-reports/home');
  }

  refreshPage() {
    let urls = this.route.url.split('/');
    if(this.route.url === '/semantic/sem-reports/home' || this.route.url === '/semantic/dqm'){
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

  openRelationModal(event) {

    // const dialogRef = this.dialog.open(CreateRelationComponent, {
    const dialogRef = this.dialog.open(RelationLayoutComponent, {
      // width: '100vh',
      // height: '79vh',
      width: '135vh',
      height: '75vh',
      data: {'semanticId': this.semanticId}
    })

  }

  openConditonsModal(data){
        const dialogRef = this.dialog.open(ConditionModalWrapperComponent, {
          // width: '800px',
          // height: '285px',
          data: {'type': 'create','semanticId': this.semanticId ,data: data }
        })
  }

  openParametersModal(data){
    // console.log(this.finalFavNonFavTables);
    // console.log(this.views);
    const dialogRef = this.dialog.open(ParametersContainerComponent, {
      // width: '800px',
      // height: '285px',
      data: { semanticId : this.semanticId , tableData : this.columns.filter(ele=>ele.view_to_admins) ,customTable : this.views }
    })
  } 

  public editDescription() {
    if (this.description == undefined) {
    this.editDescriptionValue = "" ;
    } else {
      this.editDescriptionValue = this.description
    }
  }

  public editedDescription(newDescription) {
    let assignDescription = newDescription;
    let data ={
     slId :  this.semanticId,
     description : assignDescription
    }
    this.objectExplorerSidebarService.updateSemanticDescription(data).subscribe(
      res => { this.toasterService.success(res['message']) }, err => {this.toasterService.error(err['message'])})
  }

  public showClickAction(){
  }

  public invertFavorite(mode,tableName?,event?){
    if( (!this.disableStars && mode == 0) || (!this.disableStarsCustom && mode == 1) ){
      if(tableName && event){
        //enabling the SUBMIT-button and proceeding
        let slTableId;
        if(mode ===0){
          this.disableSubmitFavorites = false;
          this.duplicateTables.map(i=>{	
            if(i.mapped_table_name === tableName ){
            slTableId =  i.sl_tables_id}
          })
        }
        else if(mode ===1){
          this.disableSubmitFavoritesCustom = false;
          this.duplicateTablesCustom.map(i=>{	
            if(i.custom_table_name === tableName ){
            slTableId =  i.custom_table_id}
          })
        }
        // console.log("Captured table value : ",tableName);
        // console.log("event cature details",event);

        if((event.path[0].localName === 'svg' && event.path[0].innerHTML.includes("M12,15.39L8") )){  
          event.path[0].innerHTML = '<path fill="#FFFFFF" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></path>'
          if(mode === 0){
            this.favoriteTables.push(slTableId);
            // console.log("this.favoriteTables after push",this.favoriteTables);
          }
          else if(mode === 1){
            this.favoriteTablesCustom.push(slTableId);
            // console.log("this.favoriteTablesCustom after push",this.favoriteTablesCustom);
          }
        }
        else if((event.path[1].localName === 'svg' && event.path[1].innerHTML.includes("M12,15.39L8") )){  
          event.path[1].innerHTML = '<path fill="#FFFFFF" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></path>'
          if(mode === 0){
            this.favoriteTables.push(slTableId);
            // console.log("this.favoriteTables after push",this.favoriteTables);
          }
          else if(mode === 1){
            this.favoriteTablesCustom.push(slTableId);
            // console.log("this.favoriteTablesCustom after push",this.favoriteTablesCustom);
          }
        }
        else if((event.path[0].localName === 'svg' && event.path[0].innerHTML.includes("M12,17.27L1"))){  
          event.path[0].innerHTML = '<path fill="#FFFFFF" d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></path>'
          // this.favoriteTables

          // let index = this.favoriteTables.indexOf(slTableId);
          let index;

          if(mode === 0){
            index = this.favoriteTables.indexOf(slTableId);
          }
          else if(mode === 1){
            index = this.favoriteTablesCustom.indexOf(slTableId);
          }

          if(index > -1){
            if(mode === 0){
              this.favoriteTables.splice(index,1);
              // console.log("this.favoriteTables after splice",this.favoriteTables);
            }
            else if(mode === 1){
              this.favoriteTablesCustom.splice(index,1);
              // console.log("this.favoriteTablesCustom after splice",this.favoriteTablesCustom);
            }
          }
          else{
          }
        }
        else if((event.path[1].localName === 'svg' && event.path[1].innerHTML.includes("M12,17.27L1"))){  
          event.path[1].innerHTML = '<path fill="#FFFFFF" d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></path>'
          // let index = this.favoriteTables.indexOf(slTableId);
          let index ;

          if(mode === 0){
            index = this.favoriteTables.indexOf(slTableId);
          }
          else if(mode === 1){
            index = this.favoriteTablesCustom.indexOf(slTableId);
          }

          if(index > -1){
            if(mode === 0){
              this.favoriteTables.splice(index,1);
              // console.log("this.favoriteTables after splice",this.favoriteTables);
            }
            else if(mode === 1){
              this.favoriteTablesCustom.splice(index,1);
              // console.log("this.favoriteTablesCustom after splice",this.favoriteTablesCustom);
            }
          }
        }
      }
    }
  }

  public setFavoriteTables(mode){
    let allTablesIds;
    let favoriteTablesIds;
    let requestBody;
    let message;

    if(mode == 0){
      this.isLoadingTables = true;
      this.showSubmitFavorites = false;
      this.disableSubmitFavorites = true;

      allTablesIds = this.duplicateTables.map(i=>i.sl_tables_id); // var a = [1,2,3,4,5,6];
      // console.log("Using the ALL tables for processing now!",allTablesIds);
      favoriteTablesIds = this.favoriteTables; // var b = [1,2,3];
      // console.log("Using the FAVORITE tables for processing now from previous state! : ",favoriteTablesIds);
      this.nonFavoriteTablesIds = []; // var data = [];
      allTablesIds.map((d) => {
        if(favoriteTablesIds.indexOf(d) === -1) {
          this.nonFavoriteTablesIds.push(d);
        }
      })

      requestBody = {
        sl_id : this.semanticId,
        tables_to_favourite : this.favoriteTables,
        tables_not_to_favourite : this.nonFavoriteTablesIds,
        is_custom_tables : false
      }
      message = "The Favorite Tables have been updated successfully"

      // console.log("NON-FAVORITE TableIds are",this.nonFavoriteTablesIds);

      // requestBody = {
      //   sl_id : this.semanticId,
      //   tables_to_favourite : this.favoriteTables,
      //   tables_not_to_favourite : this.nonFavoriteTablesIds,
      //   is_custom_tables : false
      // }
    }
    else if(mode == 1){
      this.isLoadingViews = true;
      this.showSubmitFavoritesCustom = false;
      this.disableSubmitFavoritesCustom = true;

      allTablesIds = this.duplicateTablesCustom.map(i=>i.custom_table_id); // var a = [1,2,3,4,5,6];
      // console.log("Using the ALL tables for processing now!",allTablesIds);
      favoriteTablesIds = this.favoriteTablesCustom; // var b = [1,2,3];
      // console.log("Using the FAVORITE tableIds CUSTOM for processing now!",this.favoriteTablesCustom);
      this.nonFavoriteTablesIdsCustom = []; // var data = [];
      allTablesIds.map((d) => {
        if(favoriteTablesIds.indexOf(d) === -1) {
          this.nonFavoriteTablesIdsCustom.push(d);
        }
      })

      requestBody = {
        sl_id : this.semanticId,
        tables_to_favourite : this.favoriteTablesCustom,
        tables_not_to_favourite : this.nonFavoriteTablesIdsCustom,
        is_custom_tables : true
      }
      message = "The Favorite Custom Tables have been updated successfully"

      // console.log("NON-FAVORITE TableIds CUSTOM are",this.nonFavoriteTablesIdsCustom);
      
      // requestBody = {
      //   sl_id : this.semanticId,
      //   tables_to_favourite : this.favoriteTablesCustom,
      //   tables_not_to_favourite : this.nonFavoriteTablesIdsCustom,
      //   is_custom_tables : true
      // }
      
    }

    // if(mode == 0){
    //   requestBody = {
    //     sl_id : this.semanticId,
    //     tables_to_favourite : this.favoriteTables,
    //     tables_not_to_favourite : this.nonFavoriteTablesIds,
    //     is_custom_tables : false
    //   }
    //   message = "The Favorite Tables have been updated successfully"
    // }
    // else if(mode == 1){
    //   requestBody = {
    //     sl_id : this.semanticId,
    //     tables_to_favourite : this.favoriteTablesCustom,
    //     tables_not_to_favourite : this.nonFavoriteTablesIdsCustom,
    //     is_custom_tables : true
    //   }
    //   message = "The Favorite Custom Tables have been updated successfully"
    // }

    this.objectExplorerSidebarService.updateFavouriteTables(requestBody).subscribe(res=>{
      if(res){
        if(mode == 0){
          // this.isLoadingTables = true;
          this.getSortedTablesRefresh(); // else getSortedViews
        }
        if(mode == 1){
          this.getSortedViewsRefresh();
        }
        this.toasterService.success(message);
        // this.fun();
        // MAYBE CALL THE PAGE-LOADING TABLES HERE!!!!!!!!!!!!!!!!!!!!!!!!!
      }
    })
  }

  public openSubmitFavorites(mode){
    // this.showSubmitFavorites = true;
    // this.disableSubmitFavorites = true;
    if(mode === 0){
      this.showSubmitFavorites = true;
      this.disableSubmitFavorites = true;
      this.disableStars = false;
    }
    else if(mode === 1){
      this.showSubmitFavoritesCustom = true;
      this.disableSubmitFavoritesCustom = true;
      this.disableStarsCustom = false;
    }
  }


  public getSortedTablesRefresh(){
    this.finalFavNonFavTables = [];
    this.semanticService.fetchsem(this.sls).subscribe(res => { 
        if(res){
          this.columns = res["data"]["sl_table"];
          this.objectExplorerSidebarService.setTables(this.columns);
          this.originalTables = JSON.parse(JSON.stringify(this.columns));
      this.columns.sort(function (a, b) {
        a = a.mapped_table_name.toLowerCase();
        b = b.mapped_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      });
      this.duplicateTables = this.columns;
      // console.log("Duplicate tables values : ",this.duplicateTables)

      let favTab = this.columns.filter(i=>i.is_favourite)
      let favTabSorted = favTab.sort(function (a, b) {
        a = a.mapped_table_name.toLowerCase();
        b = b.mapped_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }); 
      let nonFavTab = this.columns.filter(i=>i.is_favourite === false)
      let nonFavTabSorted = nonFavTab.sort(function (a, b) {
        a = a.mapped_table_name.toLowerCase();
        b = b.mapped_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }); 
      let favTabSortedCopy = favTabSorted
      Array.prototype.push.apply(favTabSortedCopy,nonFavTabSorted)
      this.finalFavNonFavTables = favTabSortedCopy;
        //  check here
      this.favoriteTables = [];
      this.finalFavNonFavTables.map(i=>{
        if(i.is_favourite) this.favoriteTables.push(i.sl_tables_id);
      })
      // console.log("this.finalFavNonFavTables : ",this.finalFavNonFavTables)
      // console.log("this.favoriteTablesCustom IDS CUSTOM : ",this.favoriteTables)
      this.columns = this.finalFavNonFavTables;
      this.disableStars = true;
      this.isLoadingTables = false;
        }
    });

  }

  public getSortedViewsRefresh(){
    this.views = [];
    if(this.sls && this.sls !== undefined){
    this.semanticService.getviews(this.sls).subscribe(res => {
      this.views = res["data"]["sl_view"];
      this.checkViews();
      this.objectExplorerSidebarService.setCustomTables(this.views);

      this.customData = JSON.parse(JSON.stringify(this.views));

      this.duplicateTablesCustom = this.views;
      this.views.sort(function (a, b) {
        a = a.custom_table_name.toLowerCase();
        b = b.custom_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      });
      this.duplicateTablesCustom = this.views;
      // console.log("Duplicate tables values : ",this.duplicateTablesCustom)

      let favTab = this.views.filter(i=>i.is_favourite)
      let favTabSorted = favTab.sort(function (a, b) {
        a = a.custom_table_name.toLowerCase();
        b = b.custom_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }); 
      let nonFavTab = this.views.filter(i=>i.is_favourite === false)
      let nonFavTabSorted = nonFavTab.sort(function (a, b) {
        a = a.custom_table_name.toLowerCase();
        b = b.custom_table_name.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }); 
      let favTabSortedCopy = favTabSorted
      Array.prototype.push.apply(favTabSortedCopy,nonFavTabSorted)
      this.finalFavNonFavTablesCustom = favTabSortedCopy;
      this.favoriteTablesCustom = [];
      this.finalFavNonFavTablesCustom.map(i=>{
        if(i.is_favourite) this.favoriteTablesCustom.push(i.custom_table_id);
      })
      // console.log("this.finalFavNonFavTablesCustom : ",this.finalFavNonFavTablesCustom)
      // console.log("this.favoriteTablesCustom IDS CUSTOM : ",this.favoriteTablesCustom)
      this.views = this.finalFavNonFavTablesCustom;
      this.disableStarsCustom = true;
      this.isLoadingViews = false;
    });
  }

    // this.objectExplorerSidebarService.getCustomTables.subscribe((viewsRefresh) => {
    //   if(viewsRefresh){
    //   this.views = viewsRefresh || [];
    //   // console.log("VIEWS being obtained: !!!",this.views);
    //   // this.duplicateTablesCustom = this.views;
      
    //   this.checkViews();
    //   this.customData = JSON.parse(JSON.stringify(viewsRefresh));

    //   this.duplicateTablesCustom = this.views;
    //   this.views.sort(function (a, b) {
    //     a = a.custom_table_name.toLowerCase();
    //     b = b.custom_table_name.toLowerCase();
    //     return (a < b) ? -1 : (a > b) ? 1 : 0;
    //   });
    //   this.duplicateTablesCustom = this.views;
    //   // console.log("Duplicate tables values : ",this.duplicateTablesCustom)

    //   let favTab = this.views.filter(i=>i.is_favourite)
    //   let favTabSorted = favTab.sort(function (a, b) {
    //     a = a.custom_table_name.toLowerCase();
    //     b = b.custom_table_name.toLowerCase();
    //     return (a < b) ? -1 : (a > b) ? 1 : 0;
    //   }); 
    //   let nonFavTab = this.views.filter(i=>i.is_favourite === false)
    //   let nonFavTabSorted = nonFavTab.sort(function (a, b) {
    //     a = a.custom_table_name.toLowerCase();
    //     b = b.custom_table_name.toLowerCase();
    //     return (a < b) ? -1 : (a > b) ? 1 : 0;
    //   }); 
    //   let favTabSortedCopy = favTabSorted
    //   Array.prototype.push.apply(favTabSortedCopy,nonFavTabSorted)
    //   this.finalFavNonFavTablesCustom = favTabSortedCopy;
    //   this.favoriteTablesCustom = [];
    //   this.finalFavNonFavTablesCustom.map(i=>{
    //     if(i.is_favourite) this.favoriteTablesCustom.push(i.custom_table_id);
    //   })

    //   // console.log("this.finalFavNonFavTablesCustom : ",this.finalFavNonFavTablesCustom)
    //   // console.log("this.favoriteTablesCustom IDS CUSTOM : ",this.favoriteTablesCustom)

    //   this.views = this.finalFavNonFavTablesCustom;
    //   this.disableStarsCustom = true;
    //   this.isLoadingViews = false;
    //   // this.fun(); //works but costly!!
    //   // this.refreshPage();

    // }
    // })
  }

  // openCCC(event, type, table) {
  //   this.objectExplorerSidebarService.setCCC(table);
  //   this.activatedRoute.snapshot.routeConfig.children[2].children[4].data.allowMultiColumn = type;  
  //   this.user.setSlRoute(true);
  //   this.route.navigate(['semantic/sem-sl/calculated-column']);
  // }

  openCCC(event, type, table) {
    this.activatedRoute.snapshot.routeConfig.children[2].children[4].data.allowMultiColumn = type;  
    this.user.setSlRoute(true);
    this.route.navigate(['semantic/sem-sl/calculated-column']);
    setTimeout(() => {
      this.objectExplorerSidebarService.setCCC(table);
    });
  }

  showTablesFlag:boolean = true;

  toggleTables(event){
    this.showTablesFlag = !event.checked;
  }

  spaceValidator(str){
    // console.log(str);
    return str?str.trim().replace(/\s+/g," ").replace(/\s/g,constants_value.column_space_replace_value):"";
  }

  spaceEnabler(str){
    let regex = new RegExp(constants_value.column_space_replace_value,"gi");
    return str.replace(regex," ")
  }

  trackByFn(index, item) {
    return index;
  }

}