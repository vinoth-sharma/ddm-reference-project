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
import { distinctUntilChanged } from 'rxjs-compat/operator/distinctUntilChanged';
import { debounceTime, map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-share-reports',
  templateUrl: './share-reports.component.html',
  styleUrls: ['./share-reports.component.css']
})
export class ShareReportsComponent implements OnInit {

  public Editor = ClassicEditor;
  public editorData: '<p>Hello, world!</p>';
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
  signNames = [];
  isDuplicate: boolean = false;
  public userid;
  public isDisabled = true;
  public signatureName: string;
  public signSelected: boolean = false;
  description: string;
  fileName: string;
  defaultError = "There seems to be an error. Please try again later.";
  @ViewChild('#editSign') editSign: ElementRef;
  public fileUpload: boolean = false;
  maxSignId: number;
  method: string = 'Email';
  format: string = 'Email';
  ftpAddress; ftpPswd; ftpUsername; ftpPort; ftpPath;

  constructor(private route: Router,
    private toasterService: ToastrService,
    private user: AuthenticationService,
    private shareReportService: ShareReportService) {
  }

  ngOnInit() {
    this.initialState();
    this.fetchSignatures();
    this.fruitCtrl.valueChanges.pipe(
      debounceTime(500),
      map((value) => value)
    ).subscribe(value => {
      if (this.isDuplicate && value !== '') {
        this.isDuplicate = false;
      }
    });
  }

  signDeleted(event) {
    this.fetchSignatures().then(result => {
      Utils.hideSpinner();
    });
  }

  add(event: MatChipInputEvent): void {
    const input = this.fruitCtrl.value;
    const value = event.value;
    this.getDuplicateMessage();
    if ((value || '').trim() && !this.fruitCtrl.invalid && !this.isDuplicate) {
      this.emails.push(value.trim());
    } else {
    }
    this.fruitCtrl.setValue('');
  }

  getDuplicateMessage() {
    if (this.emails.includes(this.fruitCtrl.value)) {
      this.isDuplicate = true;
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
    if (this.pdfFile) {
      this.pdfFile['nativeElement']['value'] = "";
    }
    this.fileUpload = false;
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
    this.formats = ['Csv', 'xlsx', 'Pdf'];
    this.deliveryMethods = ['Email', 'FTP'];
    this.method = 'Email';
    this.format = 'xlsx';
    this.description = '';
    this.reset();
    this.selectSign = null;
  };

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
    this.fileName = this.file.name;
  }

  public triggerFileBtn() {
    document.getElementById("valueInput").click();
  }

  public fetchSignatures(callback = null) {
    return new Promise((resolve, reject) => {
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
        // this.selectSign = this.signatures[0].signature_name;
        for (let i = 0; i < this.signatures.length; ++i) {
          this.signNames[i] = this.signatures[i]["signature_name"];
        }
        console.log("fetched", this.signatures);
        resolve(true);
      }, error => {
        reject(error);
      })
    });
  }

  select() {
    this.signSelected = true;
    console.log(this.selectSign, "u selected");
    const selectedSign = this.signatures.find(x =>
      x.signature_name.trim().toLowerCase() == this.selectSign.trim().toLowerCase());
    this.editorData = selectedSign.signature_html;
    this.selectedId = selectedSign.signature_id;
    if (selectedSign.user_id === 'USER1') {
    }
  }

  updateSignatureData(options) {
    Utils.showSpinner();
    console.log('existingData:', options);
    this.shareReportService.putSign(options).subscribe(res => {
      this.fetchSignatures(() => {
        this.toasterService.success("Edited successfully")
        Utils.hideSpinner();
        $('#signature').modal('hide');
      }), err => {
        this.toasterService.error(err.message || this.defaultError);
        Utils.hideSpinner();
      }
    })
  };

  createSignatureData(options) {
    Utils.showSpinner();
    this.shareReportService.createSign(options).subscribe(
      res => {
        this.toasterService.success("Created successfully")
        this.fetchSignatures().then((result) => {
          this.selectSign = null;
          Utils.hideSpinner();
          $('#signature').modal('hide');
        }).catch(err => {
          this.toasterService.error(err.message || this.defaultError);
          Utils.hideSpinner();
        })
      }, error => {
        console.log('Error');
        Utils.hideSpinner();
        $('#signature').modal('hide');
      })
  };

  requiredEmailFields() {
    return !(this.emails.length && this.selectSign && this.selectSign !== "Create new signature");
  }

  requiredFTPFields() {
    return !(this.ftpAddress && this.ftpPath && this.ftpPort && this.ftpUsername && this.ftpPswd ); 
  }

  updateSharingData() {
    Utils.showSpinner();
    if (this.method == "Email") {
      let options = {};
      options['report_name'] = this.selectedName;
      options['report_list_id'] = this.selectedId;
      options['file_format'] = this.format;
      options['delivery_method'] = this.method;
      options["recepeint_list"] = [this.emails];
      options['file_upload'] = this.file ? this.file : '';
      options['description'] = this.description;
      options['signature_html'] = this.editorData;
      console.log("emailobj", options);
      this.shareReportService.shareToUsersEmail(options).subscribe(
        res => {
          this.toasterService.success("Report has been shared successfully");
          Utils.hideSpinner();
          Utils.closeModals();
        },
        err => {
          this.toasterService.error(this.defaultError);
          Utils.hideSpinner();
        });
      this.reset();
    } else if (this.method == "FTP") {
      let options = {};
      options['report_name'] = this.selectedName;
      options['report_list_id'] = this.selectedId;
      options['file_format'] = this.format; 
      options['delivery_method'] = this.method;
      options["ftp_address"] = this.ftpAddress;
      options['ftp_port'] = this.ftpPort;
      options['ftp_folder_path'] = this.ftpPath;
      options['ftp_user_name'] = this.ftpUsername;
      options['ftp_password'] = this.ftpPswd;
      console.log("ftpobj", options);
      this.shareReportService.shareToUsersFtp(options).subscribe(
        res => {
          this.toasterService.success("Report has been shared successfully");
          Utils.hideSpinner();
          Utils.closeModals();
        },
        err => {
          this.toasterService.error(this.defaultError);
          Utils.hideSpinner();
        });
      this.initialState()
    };
  }
}
