
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { MatSort, MatTableDataSource,MatPaginator } from '@angular/material';
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router"

import { SecurityModalService } from '../security-modal/security-modal.service';
import Utils from "../../utils";


@Component({
  selector: 'app-sort-table',
  templateUrl: './sort-table.component.html',
  styleUrls: ['./sort-table.component.css']
})

export class SortTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: any;
  public rarList: any;
  public allUserList = [];
  public allSemanticList = [];  
  public displayedColumns = ['name', 'user_id', 'role', 'semantic_layers', 'privilages'];
  public show: boolean = false;
  public buttonName: any = '▼';
  public reverse: boolean = false;
  public isEmptyTables: boolean;
  public defaultError = "There seems to be an error. Please try again later.";

  constructor(private user: AuthenticationService,
              private semanticModalService: SecurityModalService,
              private toasterService: ToastrService,
              private router: Router) { }

  ngOnInit() {
    this.tableSorting();
    this.isEmptyTables = false;
    Utils.showSpinner();
  }

  public tableSorting() {
    this.user.getUser().subscribe(res => {
      this.rarList = res;
      this.dataSource = this.rarList['data'];
      // console.log("SORTING DATA IS:",this.dataSource)
      if (typeof (this.dataSource) == 'undefined' || this.dataSource.length == 0) {
        // display error message 
        this.isEmptyTables = true;
      }

      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      Utils.hideSpinner();
    }, error => {
      this.toasterService.error(this.defaultError);
      Utils.hideSpinner();
    });
  };

  /**
   * getSecurityDetails
   */
  public getSecurityDetails() {
    this.semanticModalService.getAllUserandSemanticList().subscribe(
      res => {
        this.allUserList = res['data']["users list"];
        this.allSemanticList = res['data']["semantic_layers"];
      },
      err => {
        this.allUserList = [];
        this.allSemanticList = [];
      });
  }

  public routeBack(){
    this.router.navigate(['semantic/sem-sl/sem-existing']);
  }

  public refreshRoles(){
  //   this.user.getUser().subscribe(res => {
  //     this.toasterService.success("Page reloading!!")
  // //   })
  //   Utils.showSpinner();
    this.tableSorting();
    // Utils.showSpinner();
  }

}
