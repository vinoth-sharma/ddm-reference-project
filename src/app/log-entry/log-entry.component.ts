import { Component, OnInit } from '@angular/core';
import { SecurityModalService } from '../security-modal/security-modal.service';
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-log-entry',
  templateUrl: './log-entry.component.html',
  styleUrls: ['./log-entry.component.css']
})
export class LogEntryComponent implements OnInit {

  defaultError = "There seems to be an error. Please try again later.";
  logData = {};
  public dataSource: any;
  isEmpty : boolean;
  public displayedColumns = ['changed_by_user_name', 'changed_for_user_name', 'change_type', 'change_description', 'change_timestamp','sl_name'];
  constructor(private semanticModalService: SecurityModalService,
    private toasterService: ToastrService) { }

  ngOnInit() {
    this.semanticModalService.getLogData().subscribe(res => {
      this.logData = res;
      console.log("data",  this.logData )
      this.dataSource = this.logData['data'];
      console.log(this.dataSource);
      

      // if (typeof (this.dataSource) == 'undefined' || this.dataSource.length == 0) {
      //   this.isEmpty = true;
      // }

      this.dataSource = new MatTableDataSource(this.dataSource);
    })
  //   }, error => {
  //     this.toasterService.error(this.defaultError);
      
    // });
  // };
  // }


  }
onTabChange(event){
console.log(event,event.srcElement.id)
}
}
