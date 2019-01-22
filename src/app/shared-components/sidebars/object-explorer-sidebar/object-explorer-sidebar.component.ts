import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { Router, ActivatedRoute } from "@angular/router";
import { SemdetailsService } from "../../../semdetails.service";
import { AuthenticationService } from "../../../authentication.service";
import { ObjectExplorerSidebarService } from "./object-explorer-sidebar.service";
import { ToastrService } from "ngx-toastr";
import Utils from "../../../../utils";

@Component({
  selector: "app-object-explorer-sidebar",
  templateUrl: "./object-explorer-sidebar.component.html",
  styleUrls: ["./object-explorer-sidebar.component.css"]
})

export class ObjectExplorerSidebarComponent implements OnInit {

  public columns = [];
  public button;
  public isShow = false;
  public Show = false;
  public semantic_name;
  public isCollapsed = false;
  public isLoading: boolean;
  public Loading: boolean;
  public originalTables;
  public dependentReports = [];
  public tables = [];
  public action: string = '';
  public selectedTables = [];
  public confirmFn;
  public confirmText: string = '';
  public semanticId: number; views; arr; roles; roleName; sidebarFlag; errorMsg; info; properties;
  public values;
  defaultError = "There seems to be an error. Please try again later.";
  
  constructor(private route: Router, private activatedRoute: ActivatedRoute, private user: AuthenticationService, private objectExplorerSidebarService: ObjectExplorerSidebarService, private semanticService: SemdetailsService, private toasterService: ToastrService) {
    this.semanticService.myMethod$.subscribe(columns => {    
      this.columns = Array.isArray(columns) ? columns : [];
      this.originalTables = JSON.parse(JSON.stringify(this.columns));
    });
    this.semanticId = this.activatedRoute.snapshot.data['semantic_id'];
    this.objectExplorerSidebarService.footmethod$.subscribe((errorMsg) => {
      this.errorMsg = errorMsg;
    });

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
  }

  public renameTable(obj, type) {
    let options = {};
    options["sl_tables_id"] = obj.table_id; 
    options["sl_id"] = this.activatedRoute.snapshot.data["semantic_id"];
    if (type == "column") {
      options["old_column_name"] = obj.old_val;
      options["new_column_name"] = obj.table_name;
      this.objectExplorerSidebarService.saveColumnName(options).subscribe(
        res => {
          this.toasterService.success("Column rename has been changed successfully")
        },
        err => {
          this.toasterService.error(err.message || this.defaultError);
        }
      );
    } else {
      options["table_name"] = obj.table_name;
      this.objectExplorerSidebarService.saveTableName(options).subscribe(
        res => this.toasterService.success("Table rename has been changed successfully"),
        err => {
          this.toasterService.error(err.message || this.defaultError);
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

  public setSelectedTables(tables: any[]) {
    if (this.action === 'ADD') {
      this.selectedTables = tables.map(t => t['table_name']);
    }
    else if (this.action === 'REMOVE') {
      this.selectedTables = tables.map(t => t['sl_tables_id'])
    }
  }

  public listofvalues(column, table_id) {
    this.Loading=true;
    let options = {};
    options['columnName'] = column;
    options['tableId'] = table_id;
    this.objectExplorerSidebarService.listValues(options).subscribe(res =>
   {
    this.values = res as object [];
    this.Loading=false;
   })
  }

  public columnProperties(column, table_id) {
    // this.isLoading = true;
    let options = {};
    options['columnName'] = column;
    options['tableId'] = table_id;
  //   this.objectExplorerSidebarService.colProperties(options).subscribe(res =>
  //  {this.properties = res as object [];
  //   // this.isLoading = false; 
  //   console.log(this.properties,'properties');
  //  })
  }

  public deleteTables() {
    Utils.showSpinner();
    this.objectExplorerSidebarService.deleteTables(this.selectedTables).subscribe(response => {
      this.toasterService.success(response['message'])      
      this.resetSelection();
    }, error => {
      this.toasterService.error(error.message['error'] || this.defaultError);
      this.resetSelection();
    });
  }

  public updateView(view_to_admins, tables_id) {
    let options = {};
    if (view_to_admins) {
      options['view'] = 1;
    } else {
      options['view'] = 0;
    }
    options['table_id'] = tables_id;
    this.objectExplorerSidebarService.ChangeView(options).subscribe(res => console.log(res));
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

    if (action === 'REMOVE') {
      this.getSemanticLayerTables();
      this.confirmFn = this.deleteTables;
      this.confirmText = 'Are you sure you want to delete the table(s)?';
    } else if (action === 'ADD') {
      this.getAllTables();
      this.confirmFn = this.addTables;
      this.confirmText = 'Are you sure you want to add the table(s)?';
    }
  }

  public searchTableList(key) {
    let results = [];
    if (key != "" || key != undefined) {
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

  public resetSelection() {
    Utils.hideSpinner();
    Utils.closeModals();
    this.getSemanticLayerTables();
    this.selectedTables = [];
    this.tables = [];
  }

  public getSearchInput(e){
    let inputFocus;
    this.isCollapsed = !this.isCollapsed;

    if(!this.isCollapsed){ 
      this.columns = JSON.parse(JSON.stringify(this.originalTables));
    }else{
      setTimeout(() => {
        inputFocus =  document.querySelectorAll("input#tableIdSearch");
        inputFocus[0].style.display = 'block';
        inputFocus[0].focus(); 
      });
    }
  };

  public deleteSemanticLayer(){
    this.confirmText = 'Are you sure you want to delete the semantic layer?';
  }
  
}