import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityModalService } from '../security-modal/security-modal.service';
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from "@angular/router"

@Component({
  selector: 'app-log-entry',
  templateUrl: './log-entry.component.html',
  styleUrls: ['./log-entry.component.css']
})
export class LogEntryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  defaultError = "There seems to be an error. Please try again later.";
  logData = {};
  public rolesDataSource: any;
  public semanticDataSource: any;
  public reportsDataSource: any;
  public tablesDataSource: any;
  isEmpty: boolean;
  isLoading: boolean = true;
  chosen : string = 'Roles and Responsibilities';
  public rolesColumns: string[] = ['changed_by_user_id','changed_by_user_name','changed_for_user_id', 'changed_for_user_name', 'change_type', 'change_description', 'change_timestamp', 'sl_name'];
  public semanticColumns: string[] = ['changed_by_user_id','changed_by_user_name','changed_for_user_id', 'changed_for_user_name','sl_name', 'change_type', 'change_description', 'change_timestamp'];
  public reportsColumns: string[]  = ['report_name', 'sl_name', 'change_type', 'change_description', 'change_timestamp'];
  public tablesColumns: string[]  = ['sl_name', 'change_type', 'change_description', 'new_name', 'change_timestamp'];
  public selections = ['Roles and Responsibilities','Semantic Layer','Tables and Custom tables','Reports'];
  selected: string = 'Roles and Responsibilities';
  // applyFilter(filterValue : string) {
  //       this.rolesDataSource.filter = filterValue.trim().toLowerCase();
  // }
  constructor(private semanticModalService: SecurityModalService,
    private toasterService: ToastrService,
    private router: Router) { }

  ngOnInit() {

    // this.rolesDataSource.paginator = this.paginator;
    // this.reportsDataSource.paginator = this.paginator;
    // this.semanticDataSource.paginator = this.paginator;
    // this.tablesDataSource.paginator = this.paginator;
    this.semanticModalService.getLogData(1).subscribe(res => {
      this.logData = res;
      this.isLoading = false;
      this.rolesDataSource = this.logData['data'];
      this.rolesDataSource = new MatTableDataSource(this.rolesDataSource);
           this.rolesDataSource.paginator = this.paginator;
      this.rolesDataSource.sort = this.sort; 
    })
    //   }, error => {
    //     this.toasterService.error(this.defaultError);

    // });
    // };
    // }
  }

  public routeBack(){
    this.router.navigate(['semantic/sem-sl/sem-existing']);
  }

  onSelect(event) {
    this.isLoading= true;
    if (event.source.value == "Semantic Layer") {     
     this.chosen = 'Semantic Layer';
      this.semanticModalService.getLogData(2).subscribe(res => {
        this.logData = res;
        this.isLoading = false;
        this.semanticDataSource = this.logData['data'];
        this.semanticDataSource = new MatTableDataSource(this.semanticDataSource);
        this.semanticDataSource.paginator = this.paginator;
        if (typeof (this.semanticDataSource) == 'undefined' || this.semanticDataSource.length == 0) {
          this.isEmpty = true;
        }
      })
    } else if (event.source.value == "Reports") {
      this.chosen = 'Reports';
      this.semanticModalService.getLogData(4).subscribe(res => {
        this.logData = res;
        this.isLoading = false;
        this.reportsDataSource = this.logData['data'];
        this.reportsDataSource = new MatTableDataSource(this.reportsDataSource);
        this.reportsDataSource.paginator = this.paginator;
        if (typeof (this.reportsDataSource) == 'undefined' || this.reportsDataSource.length == 0) {
          this.isEmpty = true;
        }
      })
    } else if (event.source.value == "Roles and Responsibilities") {
      this.chosen = 'Roles and Responsibilities';
      this.semanticModalService.getLogData(1).subscribe(res => {
        this.logData = res;
        this.isLoading = false;
        this.rolesDataSource = this.logData['data'];
        this.rolesDataSource = new MatTableDataSource(this.rolesDataSource);
        this.rolesDataSource.paginator = this.paginator;
        this.rolesDataSource.sort = this.sort;
        if (typeof (this.rolesDataSource) == 'undefined' || this.rolesDataSource.length == 0) {
          this.isEmpty = true;
        }
      })
    } else if (event.source.value == "Tables and Custom tables") {
      this.chosen = 'Tables and Custom tables';
      this.semanticModalService.getLogData(3).subscribe(res => {
        this.logData = res;
        this.isLoading = false;
        this.tablesDataSource = this.logData['data'];
        this.tablesDataSource = new MatTableDataSource(this.tablesDataSource);
        this.tablesDataSource.paginator = this.paginator;
        if (typeof (this.tablesDataSource) == 'undefined' || this.tablesDataSource.length == 0) {
          this.isEmpty = true;
        }
      }
      )
    }
  }
}

