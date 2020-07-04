import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { DjangoService } from 'src/app/rmp/django.service';
import Utils from 'src/utils';

// Angular Component developed by Deepak Urs G V
@Component({
  selector: 'app-file-list-modal',
  templateUrl: './file-list-modal.component.html',
  styleUrls: ['./file-list-modal.component.css']
})
export class FileListModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FileListModalComponent>,
    public toaster: NgToasterComponent,
    public djangoService: DjangoService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  public backupData: any;
  public finalReturnData: any;

  ngOnInit() {
    this.backupData = this.data;
    console.log("BACKUP DATA : ", this.backupData);

    let oldFiles = this.data.map(i => { if (i['file_id']) return i; })
    oldFiles = oldFiles.filter(Boolean)
    let newFiles = this.data.map(i => { if (i['type']) { return { file_id: 'NA', file_name: i['name'] } } else { }; })
    newFiles = newFiles.filter(Boolean)
    Array.prototype.push.apply(oldFiles, newFiles)
    console.log("NEW PROCURED FILE NAMES : ", oldFiles);
    this.data = oldFiles;
    console.log("INPUT FILE LIST : ", this.data);
  }

  public closeDialog(): void {
    //separate the data back to original state and send it back

    let nonFileIdFiles = [];
    let fileIdFiles = [];
    this.data.map(i => { if (i['file_id'] != 'NA') { fileIdFiles.push(i); } else { nonFileIdFiles.push(i); } })

    console.log("nonFileIdFiles values : ", nonFileIdFiles);
    console.log("fileIdFiles values : ", fileIdFiles);

    let latestFileIdFiles = [];
    let latestNonFileIdFiles = [];

    fileIdFiles.map((t, index) => { if (t['file_id'] == this.backupData[index]['file_id']) { latestFileIdFiles.push(t) } })
    latestFileIdFiles.filter(Boolean)

    this.backupData.map(i => { if (i['name']) { latestNonFileIdFiles.push(i) } })
    latestNonFileIdFiles.filter(Boolean)

    let finalLatestNonFileIdFiles = [];
    latestNonFileIdFiles = Array.from(latestNonFileIdFiles)
    latestNonFileIdFiles.map((t, index) => { if (t['name'] == nonFileIdFiles[index]['file_name']) { finalLatestNonFileIdFiles.push(t) } })
    finalLatestNonFileIdFiles.filter(Boolean)

    // latestNonFileIdFiles = nonFileIdFiles;

    Array.prototype.push.apply(latestFileIdFiles, finalLatestNonFileIdFiles)
    this.data = latestFileIdFiles;

    this.dialogRef.close(this.data);
  }

  public deleteFileCapture(file) {
    let newArray = [];
    let tempData = Array.from(this.data);

    // file-id deletion with a flag set
    let deleteAPICallFlag = false;
    tempData.map(i => {
      if (i['file_name'] == file['file_name']) {
        if (i['file_id'] != 'NA') {
          deleteAPICallFlag = true;
        }
      }
      // non-file-id deletion
      else {
        newArray.push(i)
      }
    })

    if (deleteAPICallFlag) {
      Utils.showSpinner()
      this.djangoService.delete_upload_doc(file['file_id']).subscribe(res => {
        if (res) {
          Utils.hideSpinner();
          this.toaster.success(file.file_name + " removed successfully!!")
        }
      },
        res => {
          Utils.hideSpinner();
          this.toaster.error(file.file_name + " removed failed!!")
        })
    }
    else {
      this.toaster.success(file.file_name + " removed successfully!!")
    }

    this.data = newArray;

    // CC the refining logic again
    let nonFileIdFiles = [];
    let fileIdFiles = [];
    this.data.map(i => { if (i['file_id'] != 'NA') { fileIdFiles.push(i); } else { nonFileIdFiles.push(i); } })

    console.log("nonFileIdFiles values : ", nonFileIdFiles);
    console.log("fileIdFiles values : ", fileIdFiles);

    let latestFileIdFiles = [];
    let latestNonFileIdFiles = [];

    fileIdFiles.map((t, index) => { if (t['file_id'] == this.backupData[index]['file_id']) { latestFileIdFiles.push(t) } })
    latestFileIdFiles.filter(Boolean)
    console.log("latestFileIdFiles values :", latestFileIdFiles);


    // this is going back to original.. change it 
    this.backupData.map(i => { if (i['name']) { latestNonFileIdFiles.push(i) } })
    latestNonFileIdFiles.filter(Boolean)
    console.log("latestNonFileIdFiles values :", latestNonFileIdFiles);

    let finalLatestNonFileIdFiles = [];
    latestNonFileIdFiles = Array.from(latestNonFileIdFiles)
    latestNonFileIdFiles.map((t, index) => {
      if (t['name'] == nonFileIdFiles[index]['file_name']) {
        finalLatestNonFileIdFiles.push(t)
      }
    })
    finalLatestNonFileIdFiles.filter(Boolean)

    Array.prototype.push.apply(latestFileIdFiles, finalLatestNonFileIdFiles)
    this.backupData = latestFileIdFiles;
  }

}