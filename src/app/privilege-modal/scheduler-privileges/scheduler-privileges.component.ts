import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-scheduler-privileges',
  templateUrl: './scheduler-privileges.component.html',
  styleUrls: ['./scheduler-privileges.component.css']
})
export class SchedulerPrivilegesComponent implements OnInit {

  public privilegeItems = [{name: 'Limit number of scheduled workbooks', parameter:'Workbooks',value: 10},
  {name: 'Expire results', parameter:'Days before expiration',value: 909},
  {name: 'Commit Size', parameter:'Number of rows',value: 675},
  {name: 'Restrict the hours during which a workbook may be scheduled(HH24:MM)', parameter:'',value: 3000}];
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<SchedulerPrivilegesComponent>,
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
