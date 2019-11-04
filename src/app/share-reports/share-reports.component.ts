import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent, MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { ShareReportService } from './share-report.service';
import Utils from "../../utils";
import { ToastrService } from "ngx-toastr";
import ClassicEditor from '../../assets/cdn/ckeditor/ckeditor.js';
import { Router } from '@angular/router';
import { AuthenticationService } from "../authentication.service";
import { CreateReportLayoutService } from '../create-report/create-report-layout/create-report-layout.service';
import { ScheduleService } from '../schedule/schedule.service';
declare var $: any;

@Component({
  selector: 'app-share-reports',
  templateUrl: './share-reports.component.html',
  styleUrls: ['./share-reports.component.css']
})
export class ShareReportsComponent implements OnInit {

  public Editor = ClassicEditor;
  public editorData;
  public currentValue;
  public isNotEmpty: boolean = false;
  public loading: boolean;
  @Input() selectedId: number;
  @Input() selectedName: string;
  selectedReqId: number;
  @Input() sheet_names;
  @Input() sheet_ids;
  @ViewChild('pdf')
  pdfFile: ElementRef;
  public shareData: any = {};
  public formats: any = [];
  public deliveryMethods: any = [];
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
  format: string = 'xlsx';
  ftpAddress; ftpPswd; ftpUsername; ftpPort; ftpPath;
  public selected_id: number;
  public userId: string;
  public userList = [];
  autoUserList = [];
  imageId: number;
  public userRole;
  dropdownSettings = {};
  selectedSheets = [];
  selectedSheetIds = [];


  constructor(private route: Router,
    private toasterService: ToastrService,
    private user: AuthenticationService,
    private shareReportService: ShareReportService,
    private authenticationService: AuthenticationService,
    private createReportLayoutService: CreateReportLayoutService,
    private scheduleService: ScheduleService) {
    this.user.myMethod$.subscribe(role => {
      if (role) {
        this.userRole = role["role"];
      }
    })
  }

  ngOnInit() {
    this.initialState();
    // this.fruitCtrl.valueChanges.pipe(
    //   debounceTime(500),
    //   map((value) => value)
    // ).subscribe(value => {
    //   if (this.isDuplicate && value !== '') {
    //     this.isDuplicate = false;
    //   }
    // });
    this.dropdownSettings = {
      singleSelection: false,
      allowSearchFilter: false,
      itemShowLimit: 7
    }
    this.authenticationService.errorMethod$.subscribe(userId => {
      this.userId = userId
      this.fetchSignatures();
    }
    );

    this.fruitCtrl.valueChanges
      .distinctUntilChanged()
      .subscribe(value => {
        if ((value || '').trim() && value.length >= 3) {
          this.loading = true;
          this.shareReportService.verifyUser(value).subscribe(res => {
            this.autoUserList = res['data'];
            this.loading = false;
          })
        }
      });
  }

  fetchSheetIds() {
    let indices = [];
    let values = [];
    for (let i = 0; i < this.selectedSheets.length; i++) {
      indices.push(this.sheet_names.indexOf(this.selectedSheets[i]))
    }
    indices.forEach(ele => { values.push(this.sheet_ids[ele]); })
    this.selectedSheetIds = values;
  }

  add(event: MatChipInputEvent): void {
    const input = this.fruitCtrl.value;
    const value = event.value;
    this.getDuplicateMessage(this.fruitCtrl.value);
    if ((value || '').trim() && !this.fruitCtrl.invalid && !this.isDuplicate) {
      this.emails.push(value.trim());
    } else {
    }
    this.fruitCtrl.setValue('');
  }

  onSelectionChanged(data) {
    this.getDuplicateMessage(data.option.value);
    if (data.option.value && !this.isDuplicate) {
      this.emails.push(data.option.value);
    }
    this.fruitCtrl.setValue('');
  }

  getDuplicateMessage(data) {
    if (this.emails.includes(data)) {
      this.isDuplicate = true;
    }
    else {
      this.isDuplicate = false;
    }
  };

  ngOnChanges() {
    if (this.selectedId) {
      this.getRequestId();
    }
  }

  getRecipientList() {
    this.createReportLayoutService.getRequestDetails(this.selectedReqId).subscribe(
      (res:any) => {
        if(res.user_data.length)
          this.emails.push(res['user_data'][0]['email'])
        if(res.dl_list.length)
          this.emails.push(res['dl_list'][0]['distribution_list'])
          
        // if ((res['user_data'][0]['email']).trim() && (res['dl_list'][0]['distribution_list']).trim() ) {
        //   this.emails.push(res['user_data'][0]['email'],res['dl_list'][0]['distribution_list']);
        // }
      })
  }

  getRequestId() {
    this.scheduleService.getRequestDetailsForScheduler(this.selectedId).subscribe(
      res => {
        if(res['data'][0]['request_id']) {
          this.selectedReqId = res['data'][0]['request_id'];
          this.getRecipientList();
        }        
      })
  }

  signDeleted(event) {
    this.fetchSignatures().then(result => {
      Utils.hideSpinner();
    });
  }

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
    document.getElementById("desc").innerText = "";
    this.fruitCtrl.setValue('');
    this.formats = ['csv', 'xlsx'];
    this.deliveryMethods = ['Email', 'FTP', 'ECS'];
    this.method = 'Email';
    this.format = 'xlsx';
    this.description = '';
    this.reset();
    this.selectSign = null;
    this.selectedReqId = null;
    this.imageId = null;
    this.ftpAddress = '';
    this.ftpPswd = '';
    this.ftpUsername = '';
    this.ftpPort = '';
    this.ftpPath = '';
    this.selectedSheets = [];
    this.selectedSheetIds = [];
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
    this.imageId = selectedSign.image_id;
  }

  updateSignatureData(options) {
    Utils.showSpinner();
    this.shareReportService.putSign(options).subscribe(
      res => {
        this.toasterService.success("Signature edited successfully")
        this.fetchSignatures().then((result) => {
          // this.selectSign = null;
          this.editorData = options.html;
          if (this.editorData.includes('<img src=')) {
            this.imageId = options.imageId;
          } else {
            this.imageId = null;
          }
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
        this.toasterService.success("Signature created successfully")
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
    return !(this.emails.length && this.selectSign && this.isNotEmpty && this.selectedSheetIds.length && this.selectSign !== "Create new signature");
  }

  requiredFTPFields() {
    return !(this.selectedSheetIds.length && this.ftpAddress && this.ftpPort && this.ftpUsername && this.ftpPswd && this.emails.length && this.selectSign && this.isNotEmpty && this.selectSign !== "Create new signature");
  }

  formDescription() {
    var a = document.getElementById("desc");
    this.description = a.innerHTML;
    if (document.getElementById("desc").innerText.trim() != "") {
      this.isNotEmpty = true;
    }
    else {
      this.isNotEmpty = false;
    }
  }

  updateSharingData() {
    Utils.showSpinner();
    if (this.method == "Email" || this.method == "ECS") {
      let options = {};
      options['report_name'] = this.selectedName;
      options['report_list_id'] = this.selectedId;
      options['report_request_id'] = this.selectedReqId ? this.selectedReqId : '';
      options['file_format'] = this.format;
      options['delivery_method'] = this.method;
      options["recepeint_list"] = this.emails;
      options['file_upload'] = this.pdfFile ? (this.pdfFile.nativeElement.files[0] ? this.pdfFile.nativeElement.files[0] : '') : '';
      options['description'] = this.description;
      options['signature_html'] = this.editorData;
      options['image_id'] = this.imageId ? this.imageId : '';
      options['sheet_id'] = this.selectedSheetIds;
      this.shareReportService.shareToUsersEmail(options).subscribe(
        res => {
          this.toasterService.success("Report shared successfully");
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
      options['file_upload'] = this.pdfFile ? (this.pdfFile.nativeElement.files[0] ? this.pdfFile.nativeElement.files[0] : '') : '';
      options['report_list_id'] = this.selectedId;
      options['file_format'] = this.format;
      options['recepeint_list'] = this.emails;
      options['report_request_id'] = this.selectedReqId ? this.selectedReqId : '';
      options['description'] = this.description;
      options['signature_html'] = this.editorData;
      options['delivery_method'] = this.method;
      options["ftp_address"] = this.ftpAddress;
      options['ftp_port'] = this.ftpPort;
      options['ftp_folder_path'] = this.ftpPath;
      options['ftp_user_name'] = this.ftpUsername;
      options['ftp_password'] = this.ftpPswd;
      options['image_id'] = this.imageId ? this.imageId : '';
      options['sheet_id'] = this.selectedSheetIds;
      this.shareReportService.shareToUsersFtp(options).subscribe(
        res => {
          this.toasterService.success("Report shared successfully");
          Utils.hideSpinner();
          Utils.closeModals();
          this.initialState();
          this.reset();
        },
        err => {
          this.toasterService.error(this.defaultError);
          Utils.hideSpinner();
        });
    };
  }
}