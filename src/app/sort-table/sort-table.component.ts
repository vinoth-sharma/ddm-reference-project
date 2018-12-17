
import { Component, OnInit,ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import { MatSort,MatSortable,MatTableDataSource } from '@angular/material';
// import { UserService } from '../user.service';
import { JoinPipe } from 'angular-pipes';
// import { OrderPipe } from 'ngx-order-pipe';

 
@Component({
  selector: 'app-sort-table',
  templateUrl: './sort-table.component.html',
  styleUrls: ['./sort-table.component.css']
})
export class SortTableComponent implements OnInit {
@ViewChild(MatSort) sort : MatSort;
  dataSource;
  rarList;
  rar_rolesSmallTable;
  sortedCollection;
  rarRolename;
  
  rarListTable;
  rar_rolesMiniTable;
  displayedColumns = ['name','role','semantic_layers','privilages'];
  public show:boolean = false;
  public buttonName:any = '▼';
  order: string = 'info.name';
  reverse: boolean = false; 
  
  // private userService: UserService,
  // constructor( private user: AuthenticationService, private http: Http,private orderPipe: OrderPipe) {
    constructor( private user: AuthenticationService, private http: Http) {

    
      // this.sortedCollection = orderPipe.transform(this.rarListTable, 'info.name' );
      // console.log("SortedCollectionLog here")
      // console.log(this.sortedCollection);
    
   }

  //  setOrder(value: string) {
  //   if (this.order === value) {
  //     this.reverse = !this.reverse;
  //   }

  //   this.order = value;
  //   console.log('setOrder',value,this.order)
  // }

  public abc() {
    this.user.getUser().subscribe((res) => {
      // if(!results) {
      //   return;
      // }
      console.log("result fetched");
      console.log(res);
       
      this.rarList = res;
      console.log("result fetched and put in rarList next");
      console.log(this.rarList);  
      console.log("in rarList data key having values is got ");
      this.rarListTable = this.rarList['data'];
      this.rarRolename = this.rarListTable['roles'];
      console.log(this.rarListTable);
      console.log(this.rarRolename);

      // this.rarRolename = this.rarListTable['roles'];
      // console.log(this.rarListTable);
      // console.log(this.rarRolename);

      // this.rarRolename = this.rarListTable['roles[0][role_name]'];
      // console.log(this.rarListTable);
      // console.log(this.rarRolename);
      
      // this.rar_rolesMiniTable=this.rarListTable['roles']
      // console.log("Mini table fetched");
      // console.log(this.rar_rolesMiniTable);
      
      
      // this.rar_rolesSmallTable=this.rarListTable['data.roles']
      // console.log("Small table fetched");
      // console.log(this.rar_rolesSmallTable);
     
      // // this.dataSource2 = this.

      this.dataSource = this.rarList['data'];
      console.log(this.dataSource);
      console.log("dataSource fetched");
      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.sort = this.sort;
      // this.dataSource.sort = this.sort;
    },(error) => {console.log("FAILURE")})
  };
  ngOnInit() {
    
    this.abc();

  }

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)  
      this.buttonName = "▲";
    else
      this.buttonName = "▼";
  }
}
