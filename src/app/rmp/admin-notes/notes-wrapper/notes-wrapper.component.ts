import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubmitRequestService } from '../../submit-request/submit-request.service';
import Utils from 'src/utils';

@Component({
  selector: 'app-notes-wrapper',
  templateUrl: './notes-wrapper.component.html',
  styleUrls: ['./notes-wrapper.component.css']
})
export class NotesWrapperComponent implements OnInit {

  selected = new FormControl(0);
  lookuptabledata: any = [];

  constructor(public dialogRef: MatDialogRef<NotesWrapperComponent>,
    public submitService: SubmitRequestService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    Utils.showSpinner();
    this.submitService.getHttpLookUpTableData().subscribe(res => {
      this.lookuptabledata = res.data.admin_note;
      Utils.hideSpinner();
    })
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

}