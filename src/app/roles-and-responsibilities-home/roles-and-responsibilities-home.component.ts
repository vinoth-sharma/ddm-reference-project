import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgToasterComponent } from "../custom-directives/ng-toaster/ng-toaster.component";
import { Router } from "@angular/router"

import { SecurityModalService } from '../security-modal/security-modal.service';
import Utils from "../../utils";


@Component({
  selector: 'app-rar-home',
  templateUrl: './roles-and-responsibilities-home.component.html',
  styleUrls: ['./roles-and-responsibilities-home.component.css']
})

export class RolesAndResponsibilitiesHomeComponent implements OnInit {

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
    private toasterService: NgToasterComponent,
    private router: Router
  ) { }

  ngOnInit() {
    this.tableSorting();
    this.isEmptyTables = false;
    Utils.showSpinner();
  }

  public tableSorting() {
    this.user.getUser().subscribe(res => {
      Utils.showSpinner();
      this.rarList = res;
      this.dataSource = this.rarList['data'];
      // //console.log("SORTING DATA IS:",this.dataSource)
      if (typeof (this.dataSource) == 'undefined' || this.dataSource.length == 0) {
        // display error message 
        this.isEmptyTables = true;
      }

      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
        if (typeof data[sortHeaderId] === 'string')
          return data[sortHeaderId].toLocaleLowerCase();

        return data[sortHeaderId];
      }
      Utils.hideSpinner();
    }, error => {
      this.toasterService.error(this.defaultError);
      Utils.hideSpinner();
    });
  };

  public routeBack() {
    this.router.navigate(['semantic/sem-sl/sem-existing']);
  }

  public refreshRoles() {
    this.tableSorting();
  }

}
