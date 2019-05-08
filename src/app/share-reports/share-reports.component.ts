import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { ShareReportService } from './share-report.service'
import Utils from "../../utils";
import { ToastrService } from "ngx-toastr";
import ClassicEditor from '../../assets/cdn/ckeditor/ckeditor.js';
import { Router } from '@angular/router';
import { AuthenticationService } from "../authentication.service";
declare var $: any;

@Component({
  selector: 'app-share-reports',
  templateUrl: './share-reports.component.html',
  styleUrls: ['./share-reports.component.css']
})
export class ShareReportsComponent implements OnInit {

  public Editor = ClassicEditor;
  public editorData: '<p>Hello, world!</p>';
  public editorCreate: '<p>Create New!</p>';
  @Input() selectedId: number;
  @Input() selectedName: string;
  @ViewChild('pdf')
  pdfFile: ElementRef;
  public shareData: any = {};
  public formats: any = [];
  public deliveryMethods: any = [];
  public sheetList: any = [];
  public isSheets: boolean;
  public isSignature: boolean;
  file: File;
  baseFile;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('', [Validators.required]);
  emails = [];
  reader;
  selectSign: string;
  selectId;
  isValid: boolean = true;
  signatures = [];
  isDuplicate: boolean = false;
  public userid;
  arr;
  public isDisabled = true;
  public signatureName: string;
  public signSelected: boolean = false;
  description: string;
  fileName;
  defaultError = "There seems to be an error. Please try again later.";
  @ViewChild('#editSign') editSign: ElementRef;
  public fileUpload: boolean = false;
  maxSignId: number;

  constructor(private route: Router,
    private toasterService: ToastrService,
    private user: AuthenticationService,
    private shareReportService: ShareReportService) {
    this.user.myMethod$.subscribe((arr) => this.arr = arr);
    this.userid = this.arr.user;
    console.log("arr", this.arr);
    console.log("userid", this.userid);
  }

  ngOnInit() {
    this.initialState();
    this.fetchSignatures();
  }

  add(event: MatChipInputEvent): void {
    const input = this.fruitCtrl.value;
    console.log(this.fruitCtrl.value, "input")
    const value = event.value;
    console.log(value, "value")
    this.getDuplicateMessage();
    if ((value || '').trim() && !this.fruitCtrl.invalid && !this.isDuplicate ) {
      this.emails.push(value.trim());
      //   this.isDuplicate = false;
      // this.isValid = true;
    } else {
      console.log('Error');
    }
    this.fruitCtrl.setValue('');
  }


  getDuplicateMessage() {
    if (this.emails.includes(this.fruitCtrl.value)) {
      this.isDuplicate = true;
      console.log("duplicate found")
    }
    else {
      this.isDuplicate = false;
    }
  };

  remove(email) {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  reset() {
    console.log(this.pdfFile.nativeElement.files);
    this.pdfFile.nativeElement.value = "";
    this.fileUpload = false;
    console.log(this.pdfFile.nativeElement.files);
  }

  public initialState() {
    this.shareData = {
      'reportName': '',
      'reportType': 'Entire Report',
      'format': '',
      'delivery': 'Email',
      'dMethod': {
        'email': {
          'eUsers': '',
          'eView': false,
          'eDesc': '',
          'eSignature': ''
        },
        'ftp': {
          'ftpAdrs': '',
          'ftpPort': '',
          'ftpDesc': ''
        },
        'drive': {
          'dLink': '',
          'dDesc': ''
        }
      },
    };
    this.emails = [];
    this.formats = ['Csv', 'Excel', 'Pdf'];
    this.deliveryMethods = ['Email', 'FTP'];
    this.isSheets = false;
    this.isSignature = false;
    // this.pdfFile.nativeElement.value = "";
    this.selectSign = null;
  };

  // toggleDisabled

  public autoSize(el) {
    let element = el;
    setTimeout(function () {
      element.style.cssText = 'height:auto;';
      let height = element.scrollHeight + 5;
      element.style.cssText = 'height:' + height + 'px';
    }, 0)
  }

  uploadPdf(event) {
    this.file = event.target.files[0];
    if (this.file) {
      this.fileUpload = true;
    }
    console.log("file", this.file);
    this.fileName = this.file.name;
    console.log("name", this.fileName);
    var reader = new FileReader();
    reader.onload = () => {
      let res = reader.result;
      console.log("res", res)
      this.baseFile = res;
      console.log(this.baseFile.slice(28), "filtered");
    };
    console.log(reader.readAsDataURL(this.file), "data")
    console.log(this.pdfFile.nativeElement.files, "done???");
    // this.onUpload();
  }

  public triggerFileBtn() {
    document.getElementById("valueInput").click();
  }

  public fetchSignatures() {
    this.shareReportService.getSignatures().subscribe((res: {
      data: {
        signature_id: number,
        signature_name: string,
        signature_html: string,
        user_id: string,
        image_id: number
      }[]
    }) => {
      this.maxSignId = Math.max.apply(null, res.data.map(sign => sign.signature_id)) + 1;
    this.signatures = [{
      "signature_id": this.maxSignId,
      "signature_name": "Create new signature",
      "signature_html": "",
      "user_id": 'USER1',
      "image_id": null
    }, ...res['data']];
    this.selectSign = this.signatures[0].signature_name;
    console.log("this.signatures ", this.signatures)
  })
}

select(event) {
  this.signSelected = true;
  // this.selectSign = event.target.value;
  console.log(this.selectSign, "name");
  const selectedSign = this.signatures.find(x =>
    x.signature_name.trim().toLowerCase() == this.selectSign.trim().toLowerCase());
  this.editorData = selectedSign.signature_html;
  if (selectedSign.user_id === -9999) {
    $('#signature').modal('show');
  }
  console.log(this.editorData, "html");
}

CreateSignature() {
  // check if the name is unique
}

updateSignatureData() {
  // in the pop-up
}

updateSharingData() {
  let options = {};
  Utils.showSpinner();
  options['report_name'] = this.selectedId;
  options['report_list_id'] = this.selectedName;
  options['file_format'] = "xlsx";
  options['delivery_method'] = "Email";
  options['recepeint_list'] = this.emails;
  options['file_upload'] = this.file;
  options['description'] = this.description;
  // if new or old
  options['signature_html'] = this.editorData    // which editordata
  this.shareReportService.shareToUsers(options).subscribe(
    res => {
      this.toasterService.success("Report has been shared successfully")
      Utils.hideSpinner();
      Utils.closeModals();
    })
  err => {
    this.toasterService.error(err.message || this.defaultError);
  }
};
}
