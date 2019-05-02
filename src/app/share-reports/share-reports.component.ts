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
  imgPreview: any;
  file: File;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails = [];
  signatures = ['common', 'common with disclaimer','signrep1','signrep2' ];

  constructor(private toasterService: ToastrService) {
    this.Editor.editorConfig = function( config ) {
      config.toolbar = [
        { name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
        { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
        { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
        { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
        '/',
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
        { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
        { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
        '/',
        { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
        { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
        { name: 'about', items: [ 'About' ] }
      ];
    };
  }

  ngOnInit() {
    this.initialState();
  }

  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    console.log( data );
}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.emails.push({ name: value.trim() });
    }
    if (input) {
      input.value = '';
    }
  }

  remove(email): void {
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
      }
    };

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

  public uploadImage(event) {
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
      console.log("Please select an image");
    }
  }

  uploadPdf(event) {
    if (event.target.files[0]) {  //take care of the loading time 
      this.file = event.target.files[0];
      console.log("this.file", this.file);
      var reader = new FileReader();
      // reader.onload = () => {
      //   this.imgPreview = reader.result;
      //   this.imgUrl = true;
      // };
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
