
import { Component, OnInit,ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSort,MatSortable,MatTableDataSource } from '@angular/material';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sort-table',
  templateUrl: './sort-table.component.html',
  styleUrls: ['./sort-table.component.css']
})
export class SortTableComponent implements OnInit {
@ViewChild(MatSort) sort : MatSort;
  dataSource;
  displayedColumns = ['name','username','email'];
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser().subscribe(results => {
      if(!results) {
        return;
      }  
      this.dataSource = new MatTableDataSource(results);
      this.dataSource.sort = this.sort;
    })
  }


}
