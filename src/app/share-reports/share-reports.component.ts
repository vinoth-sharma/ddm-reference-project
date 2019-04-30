import { Component, OnInit } from '@angular/core';
// import  { froalaEditor} from froala
// import * as froalaEditor from 'froala-editor/js/froala_editor.pkgd.min.js';

@Component({
  selector: 'app-share-reports',
  templateUrl: './share-reports.component.html',
  styleUrls: ['./share-reports.component.css']
})
export class ShareReportsComponent implements OnInit {

  public shareData: any = {};
  public formats: any = [];
  public deliveryMethods: any = [];
  public sheetList: any = [];
  public isSheets: boolean;
  public isSignature: boolean;
  public imagePath;
  imgUrl: any;
  imgPreview: any;
  file: File;

  constructor() { }

  ngOnInit() {
    this.initialState();
    // $(function() {
    //   $('textarea#froala-editor').froalaEditor()
    // });
  }

  /**
   * initialState
   */
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

  /**
   * shareReport
   */
  public shareReport() {

  };

  /**
   * autoSize
   */
  public autoSize(el) {
    let element = el;
    setTimeout(function () {
      element.style.cssText = 'height:auto;';
      let height = element.scrollHeight + 5;
      element.style.cssText = 'height:' + height + 'px';
    }, 0)
  }

  public uploadImage(event) {
    if(event.target.files[0]){  //take care of the event time 
      this.file = event.target.files[0];
      console.log("this.file", this.file);
      var reader = new FileReader();
      reader.onload = () => {
        this.imgPreview = reader.result;
      };
      reader.readAsDataURL(this.file);
      console.log(reader, "reader")
    } else {
      console.log("Please select an image");
    }    
  }

  public triggerFileBtn() {
    document.getElementById("valueInput").click();
  }

}
