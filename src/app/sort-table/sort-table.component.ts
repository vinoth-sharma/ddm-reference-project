
  import { Component, OnInit,ViewChild } from '@angular/core';
  import { AuthenticationService } from '../authentication.service';
  import { MatSort,MatTableDataSource } from '@angular/material';
  import { SecurityModalService } from '../security-modal/security-modal.service';
  import { ToastrService } from "ngx-toastr";
  import Utils from "../../utils";

  @Component({
    selector: 'app-sort-table',
    templateUrl: './sort-table.component.html',
    styleUrls: ['./sort-table.component.css']
  })

  export class SortTableComponent implements OnInit {

    @ViewChild(MatSort) sort : MatSort;
    public dataSource : any = [];
    public rarList : any;
    public allUserList = [];
    public allSemanticList = [];
    public displayedColumns = ['name','user_id','role','semantic_layers','privilages'];
    public show:boolean = false;
    public buttonName:any = '▼';
    public order: string = 'info.name';
    public reverse: boolean = false; 
    public isEmptyTables : boolean;
    public  defaultError = "There seems to be an error. Please try again later.";
    

    constructor( private user: AuthenticationService, private semanticModalService: SecurityModalService,private toasterService: ToastrService) {

    }


    ngOnInit() {
      this.tableSorting();
      this.isEmptyTables = false;
      Utils.showSpinner();
    }


    public tableSorting() {
      this.user.getUser().subscribe((res) => {
        this.rarList = res;
        this.dataSource = this.rarList['data'];
        console.log("DATASOURCE LENGTH",this.dataSource.length)
        
        if(this.dataSource.length){
          this.isEmptyTables = true;
          this.dataSource = new MatTableDataSource(this.dataSource);
          this.dataSource.sort = this.sort;
          Utils.hideSpinner();
        }
      },(error) => {
        Utils.hideSpinner();
        this.toasterService.error(this.defaultError);
        });
    };


    public toggle() {
      this.show = !this.show;
      // CHANGE THE NAME OF THE BUTTON.
      if(this.show)  
        this.buttonName = "▲";
      else
        this.buttonName = "▼";
    }

    /**
     * getSecurityDetails
     */
    public getSecurityDetails() {
      this.semanticModalService
      .getAllUserandSemanticList()
      .subscribe(
        res => {
          this.allUserList = res['data']["users list"];
          this.allSemanticList = res['data']["semantic_layers"];
        },
        err => {
          this.allUserList = [];
          this.allSemanticList = [];
        }
      );
    }

  }
