import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { Router, ActivatedRoute } from "@angular/router";
import { SemdetailsService } from "../../../semdetails.service";
import { AuthenticationService } from "../../../authentication.service";
import { ObjectExplorerSidebarService } from "./object-explorer-sidebar.service";
import { ToastrService } from "ngx-toastr";

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
  public originalTables;
  public dependentReports = [];
  public tables = [];
  public action: string = '';
  public selectedTables = [];
  public confirmFn;
  public confirmText: string = '';
  public semanticId: number; views;arr; roles; roleName; sidebarFlag;
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private route: Router, private activatedRoute: ActivatedRoute,private user:AuthenticationService, private objectExplorerSidebarService: ObjectExplorerSidebarService, private semanticService: SemdetailsService, private toasterService: ToastrService) {
    this.semanticService.myMethod$.subscribe(columns => {
      this.columns = columns;
      this.originalTables = JSON.parse(JSON.stringify(this.columns));
    });
    this.semanticId = this.activatedRoute.snapshot.data['semantic_id'];
    // this.semanticService.myMethod$.subscribe(views => {
    // this.views = views;
    this.objectExplorerSidebarService.footmethod$.subscribe((views) =>  
      this.views = views);
      console.log("please",this.views);
      this.user.myMethod$.subscribe((arr) => 
      this.arr = arr);
    this.roles=this.arr.user;
    this.roleName=this.arr.role_check;
    this.sidebarFlag = 1; 
    ;
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
    options["table_id"] = obj.table_id;
    options["sl_id"] = this.activatedRoute.snapshot.data["semantic_id"];
    if (type == "column") {
      options["old_column_name"] = obj.old_val;
      options["new_column_name"] = obj.table_name;
      this.objectExplorerSidebarService.saveColumnName(options).subscribe(
        res => {
          console.log('rename', res);
          this.toasterService.success("Column rename has been changed successfully")},
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
    this.selectedTables.push(tableId);
    this.confirmFn = this.deleteTables;
    this.confirmText = 'Are you sure you want to delete the tables ?';
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

  public deleteTables() {
    this.objectExplorerSidebarService.deleteTables(this.selectedTables).subscribe(response => {
      this.getSemanticLayerTables();
      this.toasterService.success(response['message']);
      this.selectedTables = [];
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    });
  }
  public updateView(view_to_admins,tables_id) { 
    let options = {};
    if(view_to_admins){
    options['view'] = 1;
   }else{
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
    this.objectExplorerSidebarService.addTables(data).subscribe(response => {
      this.getSemanticLayerTables();
      this.toasterService.success(response['message'])
      this.selectedTables = [];
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    });
  }

  public getSemanticLayerTables() {
    this.isLoading = true;
    this.selectedTables = [];
    this.semanticService.fetchsem(this.semanticId).subscribe(response => {
      this.columns = response['data']['sl_table'];
      this.tables = response['data']['sl_table']
      this.isLoading = false;
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    })
  }

  public getAllTables() {
    this.isLoading = true;
    this.objectExplorerSidebarService.getAllTables(this.semanticId).subscribe(response => {
      this.tables = response['data'];
      this.isLoading = false;
    }, error => {
      this.toasterService.error(error.message || this.defaultError);
    })
  }

  public listofvalues(column,table_id) { 
    let options = {};
    options['columnName'] = column;
    options['tableId'] = table_id;
    this.objectExplorerSidebarService.listValues(options).subscribe(res => console.log(res));}

  public setAction(action: string) {
    this.action = action;
    this.tables = [];
    this.selectedTables = [];

    if (action === 'REMOVE') {
      this.getSemanticLayerTables();
      this.confirmFn = this.deleteTables;
      this.confirmText = 'Are you sure you want to delete the tables ?';
    } else if (action === 'ADD') {
      this.getAllTables();
      this.confirmFn = this.addTables;
      this.confirmText = 'Are you sure you want to add the tables ?';
    }
  }

  public searchTableList(key) {
    let results = [];
    if (key != "" || key != undefined) {
      results = this.originalTables.filter(ele => {
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