
import { Component, OnInit,ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import { MatSort,MatSortable,MatTableDataSource } from '@angular/material';
// import { UserService } from '../user.service';
import { JoinPipe } from 'angular-pipes';

@Component({
  selector: 'app-sort-table',
  templateUrl: './sort-table.component.html',
  styleUrls: ['./sort-table.component.css']
})
export class SortTableComponent implements OnInit {
@ViewChild(MatSort) sort : MatSort;
  dataSource;
  displayedColumns = ['name','username','email'];
  // private userService: UserService,
  constructor( private user: AuthenticationService, private http: Http) { }


  public abc() {
    this.user.getUser().subscribe((res) => {
      // if(!results) {
      //   return;
      // }
      console.log(res);  
      // this.dataSource = new MatTableDataSource(res);
      // this.dataSource.sort = this.sort;
    },(error) => {console.log("FAILURE")})
  };
  ngOnInit() {
    
    this.abc();

  }
}
