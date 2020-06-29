import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { newArray } from '@angular/compiler/src/util';

// Angular Component developed by Deepak Urs G V
@Component({
  selector: 'app-file-list-modal',
  templateUrl: './file-list-modal.component.html',
  styleUrls: ['./file-list-modal.component.css']
})
export class FileListModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FileListModalComponent>,
    public toaster: NgToasterComponent,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.data = this.data.files;
    console.log("INPUT FILE LIST : ", this.data);
  }

  public closeDialog(): void {
    this.dialogRef.close(this.data);
  }

  public deleteFileCapture(file) {
    console.log("FILE being deleted : ", file);
    // this.data = this.data.filter(function(el){
    //   return el.url !== file.name
    // });
    let newArray = [];
    let tempData = Array.from(this.data);
    tempData.map(i => { if (i['name'] != file['name']) { newArray.push(i) } })

    Array.prototype.push.apply(tempData, this.data);
    this.data = newArray;
    console.log("NEW ARRAY", this.data);

    this.toaster.success(file.name + " removed successfully!!")
  }

}