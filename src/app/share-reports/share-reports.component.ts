import { Component, OnInit, Input } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import Utils from "../../utils";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-share-reports',
  templateUrl: './share-reports.component.html',
  styleUrls: ['./share-reports.component.css']
})
export class ShareReportsComponent implements OnInit {

  public Editor = ClassicEditor;
  public model = {
    editorData: '<p>Hello, world!</p>'
  };
  @Input() selectedId: number;
  @Input() selectedName: string;
  public shareData: any = {};
  public formats: any = [];
  public deliveryMethods: any = [];
  public sheetList: any = [];
  public isSheets: boolean;
  public isSignature: boolean;
  imgUrl: any;
  imgPreview: any = null;
  file: File;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('', [Validators.required]);
  emails = [];
  isValid: boolean = true;
  signatures = [];
  isDuplicate: boolean = false;

  constructor(private toasterService: ToastrService) {
  }

  ngOnInit() {
    this.initialState();
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    console.log(data);
  }

  add(event: MatChipInputEvent): void {
    const input = this.fruitCtrl.value;
    console.log(this.fruitCtrl.value,"input")
    const value = event.value;
    console.log(value,"value")
    this.getPatternError();
    this.getDuplicateMessage();
    if ((value || '').trim() && this.isValid && !this.isDuplicate) {
      this.emails.push(value.trim());
    //   this.isDuplicate = false;
    // this.isValid = true;
    }
    this.fruitCtrl.setValue('');
      }

  getPatternError() {
    let email = this.fruitCtrl.value;
    if (email.indexOf("@") != -1) {
      let [_, domain] = email.split("@");
      if (domain == "gm.com") {
        this.isValid = true;
      } else {
        this.isValid = false;
        console.log("not gm")
      }
    } 
  };

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
    this.imgPreview = null,
      this.emails = [];
    this.formats = ['Csv', 'Excel', 'Pdf'];
    this.deliveryMethods = ['Email', 'FTP'];
    this.isSheets = false;
    this.isSignature = false;
  };


  public shareReport() {
    // when will it be properly shared ? toastermsg ?
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
    if (event.target.files[0]) {  //take care of the loading time 
      this.file = event.target.files[0];
      console.log("this.file", this.file);
      var reader = new FileReader();
      reader.onload = () => {
        this.imgPreview = reader.result;
        this.imgUrl = true;
      };
      reader.readAsDataURL(this.file);
      console.log(reader, "reader")
    } else {
      console.log("Please select pdf");
    }
  }

  public triggerFileBtn() {
    document.getElementById("valueInput").click();
  }
}
