import { Component, OnInit, Input} from '@angular/core';
import ClassicEditor from '../../assets/cdn/ckeditor/ckeditor.js';
import {CustomUploadAdapter} from '../share-reports/custom-upload-adapter';
import { ShareReportService } from '../share-reports/share-report.service.js';
let uploadServiceInstance: ShareReportService;
@Component({
  selector: 'app-show-signature',
  templateUrl: './show-signature.component.html',
  styleUrls: ['./show-signature.component.css']
})
export class ShowSignatureComponent implements OnInit {

  public Editor = ClassicEditor;  
  @Input() sign: string;
  @Input() editorData ;
  editorCreate : string = '';
  @Input() signSelected;
  signName ;
  public signCreate : boolean = false;  
  public editorConfig = { 
    extraPlugins: [ this.MyUploadAdapterPlugin]
  };

  constructor(private uploadService: ShareReportService) {
    uploadServiceInstance = uploadService;
  }
  // "Essentials", "CKFinderUploadAdapter", "Autoformat", "Bold", "Italic",
  //  "BlockQuote", "CKFinder", "EasyImage", "Heading", "Image", "ImageCaption", "ImageStyle",
  //   "ImageToolbar", "ImageUpload", "Link", "List", "MediaEmbed", "Paragraph",
  //    "PasteFromOffice", "Table", "TableToolbar"

  ngOnInit() {
  }

  createNew() {
    this.signCreate = true;
  }

  initial() {
    console.log(this.editorData,"editorData")
  }

  // deleteSign() {
    
  //   this.sendData.emit(this.);
  // }

  MyUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader, uploadServiceInstance);
    };
  }
}

