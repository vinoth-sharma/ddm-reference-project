import { Component, OnInit } from '@angular/core';
import { ReportViewService } from "../report-view.service";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  separators = [{ name: 'Comma(,)', value: ',' }, { name: 'Semicolon(;)', value: ';' }, { name: 'Colon(:)', value: ':' }]
  files: any = [];
  selected = {
    separator: ',',
    isHeaderAvail: true,
    file: '',
    sheet_name: '',
    file_extension: ''
  }
  sheetNameExists: boolean = false;
  enableUploadBtn: boolean = false;

  constructor(public dialogRef: MatDialogRef<UploadFileComponent>,
    public reportServices: ReportViewService) { }

  ngOnInit() {
  }


  selectorSelected(event) {
    this.selected.separator = event.value;
    this.validateForm();
  }

  validateForm() {
    if (this.files.length > 0 && this.selected.separator && (this.selected.file_extension === 'csv') && !this.isEmpty())
      this.enableUploadBtn = true;
    else
      this.enableUploadBtn = false;
  }

  uploadFile(event) {
    // console.log(event);
    this.files = [];
    this.files.push(event[0].name)
    this.selected.file = event[0];
    this.selected.file_extension = event[0].name.split('.').pop();
    this.selected.sheet_name = event[0].name.split('.').slice(0, -1).join('.').replace(/\s/g,"_").substr(0,20);
    this.validateForm();

    // for multiple files upload
    // for (let index = 0; index < event.length; index++) {
    //   const element = event[index];
    //   this.files.push(element.name)
    // }  
    // console.log(this.files);
    // console.log(this.selected);
  }

  uploadFileToServer() {
    if (!this.reportServices.checkSheetNameInReport(this.selected.sheet_name.trim())) {
      this.reportServices.loaderSubject.next(true)
      this.closeDailog();
      this.selected.sheet_name = this.selected.sheet_name.trim();
      this.reportServices.uploadFiletoSheet(this.selected).subscribe((res: any) => {
        // console.log(res);
        res.subscribe(vv => {
          // console.log(vv);
          this.sheetNameExists = false;
          this.reportServices.loaderSubject.next(false)

        })
      })
    }
    else
      this.sheetNameExists = true
  }

  deleteAttachment(index) {
    this.files.splice(index, 1)
    this.validateForm();
  }

  isEmpty(){
    return this.selected.sheet_name.trim()?false:true;
  }

  closeDailog(): void {
    this.dialogRef.close();
  }
}
