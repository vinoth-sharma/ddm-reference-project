import { Component, OnInit, Inject, SimpleChanges } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

import { FileListModalComponent } from '../file-list-modal/file-list-modal.component';
import { SubmitRequestService } from "../submit-request.service";

@Component({
  selector: 'app-additional-req-modal',
  templateUrl: './additional-req-modal.component.html',
  styleUrls: ['./additional-req-modal.component.css']
})
export class AdditionalReqModalComponent implements OnInit {

  public supportedFiles = ["csv", "pdf", "doc", "docx", "xlsx", "mp4", "zip"];
  public radioOpt = [{ label: "Yes", value: true }, { label: "No", value: false }]
  public report_title = "";
  public additional_req = "";
  l_CB_data = [];
  public selDiv: any = "";
  public selectedFilesNames: string = 'Hello World!';
  public files: any = [];
  public filesDataArrayBuffer: any = [];
  public procuredRequestId: any;
  public l_newSelectedFileDataArray: any = [];
  public breakFileAddition: Boolean = false;

  public l_data1 = [];
  public l_data2 = [];
  public responseData = {
    cb: [],
    reportTitle: "",
    addReq: "",
    isVinLevel: null,
    isSummaryReport: null,
    businessReq: "",
    selectedFile: null,
    allFileNames: ""
  }

  constructor(public dialogRef: MatDialogRef<AdditionalReqModalComponent>,
    private toaster: NgToasterComponent,
    public dialog: MatDialog,
    public submitRequestService: SubmitRequestService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.l_CB_data = this.data.checkboxData;
    this.responseData.reportTitle = this.data.l_title;
    this.responseData.addReq = this.data.l_addReq;
    this.responseData.isVinLevel = this.data.l_isVvinReq;
    this.responseData.isSummaryReport = this.data.l_isSummaryReq;
    this.responseData.businessReq = this.data.l_businessReq;
    this.responseData.selectedFile = (this.data.l_prevSeletedFiles != undefined) ? this.data.l_prevSeletedFiles : []
    this.procuredRequestId = this.data.l_requestId;

    this.selDiv = document.querySelector("#selectedFiles");

    if (this.data.l_prevSeletedFiles != undefined) {
      this.selDiv.innerHTML = this.data.l_prevSeletedFiles.map(f => f.file_name).join(",&nbsp;<br>")
      this.selDiv.innerHTML = this.selDiv.innerHTML + ",&nbsp;<br>"
    }
    else {
      this.data.l_prevSeletedFiles = [];
    }
  }


  public getFileDetails() {
    let newlySelectedFileInput = Array.from((<HTMLInputElement>document.getElementById("file-upload")).files);
    let fileNameArray = Array.from(newlySelectedFileInput)
    let fileName = fileNameArray[0]['name']

    let blockerFlag = false;
    if (newlySelectedFileInput) {
      let extension = fileName.split(".").pop();
      if (this.supportedFiles.includes(extension))
        blockerFlag = false
      else
        blockerFlag = true
    }

    if (!blockerFlag) {
      let uniqueSelectedFileInput = [];
      this.breakFileAddition = false;
      if (this.l_newSelectedFileDataArray.length == 0) {
        if (this.data.l_prevSeletedFiles.length != 0) {
          this.data.l_prevSeletedFiles.map((t) => { if (t['file_name'] == newlySelectedFileInput[0]['name']) { this.toaster.error("Please select a non-duplicate file!!"); this.breakFileAddition = true; } })
        }
        if (this.breakFileAddition == false) {
          this.l_newSelectedFileDataArray = [...newlySelectedFileInput];
          this.l_newSelectedFileDataArray = Array.from(this.l_newSelectedFileDataArray);
        }
      }
      else {
        this.l_newSelectedFileDataArray.map((t) => { if (t['name'] == newlySelectedFileInput[0]['name']) { this.toaster.error("Please select a non-duplicate file!!"); this.breakFileAddition = true; } else { uniqueSelectedFileInput.push(newlySelectedFileInput[0]) } })
        if (this.breakFileAddition == false) {
          uniqueSelectedFileInput = Array.from(uniqueSelectedFileInput)
          uniqueSelectedFileInput = uniqueSelectedFileInput.filter(i => { if (i != undefined) { return i } });
          this.l_newSelectedFileDataArray.push(uniqueSelectedFileInput[0]);
        }
      }

      // file display logic
      if ((this.submitRequestService.fileObjectDetails != undefined) && (this.submitRequestService.fileObjectDetails.length != 0)) {
        this.data.l_prevSeletedFiles = [...this.submitRequestService.fileObjectDetails];
      }
      else {
        this.data.l_prevSeletedFiles = [];
      }
      Array.prototype.push.apply(this.data.l_prevSeletedFiles, this.l_newSelectedFileDataArray);
      this.constructFileNames(this.data.l_prevSeletedFiles);
    }
    else {
      this.toaster.error(`Please upload file with valid format (${this.supportedFiles})`)
    }
  }

  public closeDailog() {
    this.toaster.success('CLOSE btn working!!')
  }

  public reviewRequest(): void {
    this.responseData.cb = [...this.l_CB_data];
    this.responseData.reportTitle = this.responseData.reportTitle.trim();
    this.responseData.addReq = this.responseData.addReq.trim();
    this.responseData.businessReq = this.responseData.businessReq ? this.responseData.businessReq.trim() : "";
    this.responseData.selectedFile = this.getFile();
    this.responseData.allFileNames = this.constructFileNames(this.data.l_prevSeletedFiles, 'regularString');

    let l_data_validation = this.responseData.cb.filter(ele => {
      if (ele.description && [1, 2].includes(ele.ddm_rmp_ots_checkbox_group_id)) { return ele }
    });
    if (!this.responseData.reportTitle.length) {
      this.toaster.error("Report Title is mandatory")
    }
    else if (!this.responseData.addReq.length) {
      this.toaster.error("Additional requirement is mandatory")
    }
    else if (!l_data_validation.every(ele => ele['desc'])) {
      this.toaster.error("Please enter the values if others selected")
    }
    else {
      this.dialogRef.close({ data: this.responseData });
    }
  }

  public getFile() {

    this.filesDataArrayBuffer = []
    let tempData = Array.from(this.data.l_prevSeletedFiles);
    let tempFileObjectsArray = []
    tempData = tempData.filter(i => { if (i['name']) { return tempFileObjectsArray.push(i) } })

    tempFileObjectsArray.forEach(file => {
      if (file) {
        let formData = new FormData();
        formData.append('file_upload', file);
        formData.append('uploaded_file_name', file.name);
        formData.append('flag', "is_req");
        formData.append('type', 'rmp');
        formData.append('request_id', this.procuredRequestId)
        this.filesDataArrayBuffer.push(formData);
      }
    })
    this.filesDataArrayBuffer = Array.from(this.filesDataArrayBuffer)

    return this.filesDataArrayBuffer;
  }

  public closeDialog() {
    this.selDiv.innerHTML = ""
    this.dialogRef.close();
  }

  public openFileChangesModal() {
    let dialogRef = this.dialog.open(FileListModalComponent, {
      data: this.data.l_prevSeletedFiles, disableClose: true
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.l_prevSeletedFiles = result;
        this.constructFileNames(result);
      }
    });
  }

  public constructFileNames(filesArray: any, regularFlag?: string) {
    let oldFileNames = filesArray.map(i => i.file_name)
    let finalOldFileNames = oldFileNames.filter(Boolean)

    let latestFileNames = filesArray.map(i => i.name)
    let finalLatestFileNames = latestFileNames.filter(Boolean)

    Array.prototype.push.apply(finalOldFileNames, finalLatestFileNames)
    if (regularFlag == undefined) {
      this.selDiv.innerHTML = finalOldFileNames.join(',&nbsp;<br>')
    }
    else if (regularFlag == 'regularString') {
      return finalOldFileNames.join(', ')
    }
  }

}