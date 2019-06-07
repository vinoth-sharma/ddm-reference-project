import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { ShareReportService } from './share-report.service';
import Utils from "../../utils";
import { ToastrService } from "ngx-toastr";
import ClassicEditor from '../../assets/cdn/ckeditor/ckeditor.js';
import { Router } from '@angular/router';
import { AuthenticationService } from "../authentication.service";
import { distinctUntilChanged } from 'rxjs-compat/operator/distinctUntilChanged';
import { debounceTime, map } from 'rxjs/operators';
import { CreateReportLayoutService } from '../create-report/create-report-layout/create-report-layout.service';
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
  @Input() selectedReqId: number;
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
  public selected_id: number;
  public userId: string;

  constructor(private route: Router,
    private toasterService: ToastrService,
    private user: AuthenticationService,
    private shareReportService: ShareReportService,
    private authenticationService: AuthenticationService,
    private createReportLayoutService : CreateReportLayoutService ) {
  }

  ngOnInit() { 
    this.initialState();
    this.fruitCtrl.valueChanges.pipe(
      debounceTime(500),
      map((value) => value)
    ).subscribe(value => {
      if (this.isDuplicate && value !== '') {
        this.isDuplicate = false;
      }
    });
    this.authenticationService.errorMethod$.subscribe(userId => {
      this.userId = userId
      this.fetchSignatures();
    }
    );
  }

  ngOnChanges() {
    // this.getRecipientList();
  }

  getRecipientList() {
    console.log("request",this.selectedReqId);   
    this.createReportLayoutService.getRequestDetails(this.selectedReqId).subscribe(
      res => {  this.emails.push(res['user_data']['email']);
      console.log("req_emails",this.emails);
      
      })
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
    this.formats = ['csv', 'xlsx', 'pdf'];
    this.deliveryMethods = ['Email', 'FTP','ECS'];
    this.method = 'Email';
    this.format = 'xlsx';
    this.description = '';
    this.reset();
    this.selectSign = null;
    this.ftpAddress = ''; 
    this.ftpPswd = ''; 
     this.ftpUsername = '';  
     this.ftpPort = '';  
     this.ftpPath = ''; 
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
    // this.getRecipientList();
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
      let user_id = this.userId;
      
      this.shareReportService.getSignatures(user_id).subscribe((res: {
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
        resolve(true);
      }, error => {
        reject(error);
      })
    });
  }

  select() {
    this.signSelected = true;
    const selectedSign = this.signatures.find(x =>
      x.signature_name.trim().toLowerCase() == this.selectSign.trim().toLowerCase());
    this.editorData = selectedSign.signature_html;
    this.selected_id = selectedSign.signature_id;
  }

  updateSignatureData(options) {
    Utils.showSpinner();
    this.shareReportService.putSign(options).subscribe(
      res => {
        this.toasterService.success("Edited successfully")
        this.fetchSignatures().then((result) => {
          this.selectSign = null;
          Utils.hideSpinner();
          $('#signature').modal('hide');
        }).catch(err => {
          this.toasterService.error(err.message || this.defaultError);
          Utils.hideSpinner();
        })
      }, error => {
        Utils.hideSpinner();
        $('#signature').modal('hide');
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
        Utils.hideSpinner();
        $('#signature').modal('hide');
      })
  };

  requiredEmailFields() {
    return !(this.emails.length && this.selectSign && this.description && this.selectSign !== "Create new signature");
  }

  requiredFTPFields() {
    return !(this.ftpAddress && this.ftpPort && this.ftpUsername && this.ftpPswd && this.emails.length && this.selectSign && this.description && this.selectSign !== "Create new signature");
  }

  updateSharingData() {
    Utils.showSpinner();
    if (this.method == "Email" || this.method == "ECS") {
      let options = {};
      options['report_name'] = this.selectedName;
      options['report_list_id'] = this.selectedId;
      options['file_format'] = this.format;
      options['delivery_method'] = this.method;
      options["recepeint_list"] = this.emails;
      options['file_upload'] = this.pdfFile ? (this.pdfFile.nativeElement.files[0] ? this.pdfFile.nativeElement.files[0] : '') : '';
      options['description'] = this.description;
      options['signature_html'] = this.editorData;
      this.shareReportService.shareToUsersEmail(options).subscribe(
        res => {
          this.toasterService.success("Report has been shared successfully");
          Utils.hideSpinner();
          Utils.closeModals();
          this.initialState();
          this.reset();
        },
        err => {
          this.toasterService.error(this.defaultError);
          Utils.hideSpinner();
        });
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
      this.shareReportService.shareToUsersFtp(options).subscribe(
        res => {
          this.toasterService.success("Report has been shared successfully");
          Utils.hideSpinner();
          Utils.closeModals();
          this.initialState();
        },
        err => {
          this.toasterService.error(this.defaultError);
          Utils.hideSpinner();
        });
    };
     }
}