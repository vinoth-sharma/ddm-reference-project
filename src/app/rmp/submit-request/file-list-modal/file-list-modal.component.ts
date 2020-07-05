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
    let oldFiles = this.data.map(i => { if (i['file_id']) return i; })
    oldFiles = oldFiles.filter(Boolean)
    let newFiles = this.data.map(i => { if (i['type']) { return { file_id: 'NA', file_name: i['name'] } } else { }; })
    newFiles = newFiles.filter(Boolean)
    Array.prototype.push.apply(oldFiles, newFiles)
    this.data = oldFiles;
  }

  public closeDialog(): void {
    let nonFileIdFiles = [];
    let fileIdFiles = [];
    this.data.map(i => { if (i['file_id'] != 'NA') { fileIdFiles.push(i); } else { nonFileIdFiles.push(i); } })

    let latestFileIdFiles = [];
    let latestNonFileIdFiles = [];

    fileIdFiles.map((t, index) => { if (t['file_id'] == this.backupData[index]['file_id']) { latestFileIdFiles.push(t) } })
    latestFileIdFiles.filter(Boolean)

    this.backupData.map(i => { if (i['name']) { latestNonFileIdFiles.push(i) } })
    latestNonFileIdFiles.filter(Boolean)
    latestNonFileIdFiles = Array.from(latestNonFileIdFiles)

    let uniqueNonFileIdFileObjects = [];
    latestNonFileIdFiles.map(i => { for (let t = 0; t < nonFileIdFiles.length; t++) { if (i['name'] == nonFileIdFiles[t]['file_name']) { uniqueNonFileIdFileObjects.push(i) } } })
    uniqueNonFileIdFileObjects.filter(Boolean)

    Array.prototype.push.apply(latestFileIdFiles, uniqueNonFileIdFileObjects)
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
  }

}