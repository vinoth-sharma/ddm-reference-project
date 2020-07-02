import { Component, OnInit, Inject, SimpleChanges } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

import { FileListModalComponent } from '../file-list-modal/file-list-modal.component';

@Component({
  selector: 'app-additional-req-modal',
  templateUrl: './additional-req-modal.component.html',
  styleUrls: ['./additional-req-modal.component.css']
})
export class AdditionalReqModalComponent implements OnInit {

  public supportedFiles = ["csv", "pdf", "doc", "docx", "xlsx"];
  public radioOpt = [{ label: "Yes", value: true }, { label: "No", value: false }]
  public report_title = "";
  public additional_req = "";
  l_CB_data = [];
  public selDiv: any = "";
  public selectedFilesNames: string = 'Hello World!';
  public testFileObjects = [];
  public files: any = [];
  public filesDataArray: any = [];
  public procuredRequestId: any;

  public l_data1 = [];
  public l_data2 = [];
  public responseData = {
    cb: [],
    reportTitle: "",
    addReq: "",
    isVinLevel: null,
    isSummaryReport: null,
    businessReq: "",
    selectedFile: null
  }

  constructor(public dialogRef: MatDialogRef<AdditionalReqModalComponent>,
    private toaster: NgToasterComponent,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.l_CB_data = this.data.checkboxData;
    this.responseData.reportTitle = this.data.l_title;
    this.responseData.addReq = this.data.l_addReq;
    this.responseData.isVinLevel = this.data.l_isVvinReq;
    this.responseData.isSummaryReport = this.data.l_isSummaryReq;
    this.responseData.businessReq = this.data.l_businessReq;
    this.procuredRequestId = this.data.l_requestId;
    console.log("ADDITIONAL REQ data obj : ",this.responseData);
    
    document.querySelector('#file-upload').addEventListener('change', this.handleFileSelect, false);
    this.selDiv = document.querySelector("#selectedFiles");
  }

  public init() {
    document.querySelector('#file-upload').addEventListener('change', this.handleFileSelect, false);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("CHANGES SEEN HERE : ", changes);

    if ('testFileObjects' in this.testFileObjects) {
      this.toaster.success('FILE CHANGE CAPTURED!!!')
    }
  }

  public handleFileSelect(e, flag?: string) {
    this.selDiv = document.querySelector("#selectedFiles");

    if (flag && flag == 'override') {
      this.selDiv.innerHTML = '';
      this.files = e;
    }
    else {
      if (!e.target.files) {
        return;
      }
      this.files = e.target.files;
    }

    for (var i = 0; i < this.files.length; i++) {
      var f = this.files[i];
      this.selDiv.innerHTML += f.name + "&nbsp" + "<br>";
      if (this.testFileObjects == undefined) {
        this.testFileObjects = [];
      }
      this.testFileObjects.push(f);
      console.log("this.selDiv.innerHTML", this.selDiv.innerHTML);
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
    else if (this.validateFile()) {
      this.toaster.error(`Please upload file with valid format (${this.supportedFiles})`)
    }
    else
      this.dialogRef.close({ data: this.responseData });
  }

  public validateFile() {
    let l_file = (<HTMLInputElement>document.getElementById("file-upload")).files;
    let tempData = Array.from(l_file);
    let blockerFlag = false;
    tempData.forEach(fileObject => {
      if (fileObject) {
        let extension = fileObject['name'].split(".").pop();
        if (this.supportedFiles.includes(extension))
          blockerFlag = false
        else
          blockerFlag = true
      }
      else {
        blockerFlag = true
      }
    });
    if (blockerFlag != false) {
      return true;
    }
    else {
      return false;
    }
  }

  public getFile() {

    let l_filesDisplay = (<HTMLInputElement>document.getElementById("file-upload")).files;
    let tempData = Array.from(l_filesDisplay);
    tempData.forEach(file => {
      if (file) {
        let formData = new FormData();
        formData.append('file_upload', file);
        formData.append('uploaded_file_name', file.name);
        formData.append('flag', "is_req");
        formData.append('type', 'rmp');
        formData.append('request_id', this.procuredRequestId)
        this.filesDataArray.push(formData);
      }
    })
    return this.filesDataArray;
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public openFileChangesModal() {
    let dialogRef = this.dialog.open(FileListModalComponent, {
      data: document.getElementById("file-upload"), disableClose: true
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("INPUT MODIFIED FILE LIST!!", result);
        this.handleFileSelect(result, 'override');
        // let l_file = (<HTMLInputElement>document.getElementById("file-upload")).files;

        // use standard varaible for result.
        // (<HTMLInputElement>document.getElementById("file-upload")).files = result;

        // console.log("CROSS CHECKING updated list of files after verifying!!");
        // console.log("(<HTMLInputElement>document.getElementById('file-upload')).files;",(<HTMLInputElement>document.getElementById("file-upload")).files);
      }
    });
  }

}