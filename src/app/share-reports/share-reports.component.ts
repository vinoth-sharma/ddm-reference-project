import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-reports',
  templateUrl: './share-reports.component.html',
  styleUrls: ['./share-reports.component.css']
})
export class ShareReportsComponent implements OnInit {

  public shareData:any = {};
  public formats:any = [];
  public deliveryMethods:any = [];
  public sheetList:any = [];
  public isSheets:boolean;

  constructor() { }

  ngOnInit() {
    this.initialState();
  }

  /**
   * initialState
   */
  public initialState() {
    this.shareData =  {
      'reportName': '',
      'reportType': 'Entire Report',
      'format': '',
      'delivery': '',
      'dMethod': {
        'email': {
          'eUsers': '',
          'eView': false,
          'eDesc': '',
          'eSignature':''
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

    this.formats = ['CSV','Excel','Word'];
    this.deliveryMethods = ['Email','Shared Drive','FTP'];
    this.sheetList = ['Sheet 1','Sheet 2','Sheet 3','Sheet 4'];
    this.isSheets = false;
  };

  /**
   * shareReport
   */
  public shareReport() {
    console.log(this.shareData);
    
  }

}
