import { Component, OnInit, AfterViewInit } from '@angular/core';
import ClassicEditor from '../../assets/cdn/ckeditor/ckeditor.js';

@Component({
  selector: 'app-show-signature',
  templateUrl: './show-signature.component.html',
  styleUrls: ['./show-signature.component.css']
})
export class ShowSignatureComponent implements OnInit {

  public Editor = ClassicEditor;
  public model = {
    editorData: '<figure class="table"><table><tbody><tr><td>swddqwdqwfe</td><td>eqf</td></tr><tr><td>efwefwe</td><td>fefwefwe</td></tr></tbody></table></figure><ul><li style="text-align:right;"><mark class="pen-red">Hello, world!gfdfgd</mark></li></ul> '
  };
  public editorConfig = { 
    extraPlugins: [ this.MyUploadAdapterPlugin]
  };

  constructor() {
  }
  // "Essentials", "CKFinderUploadAdapter", "Autoformat", "Bold", "Italic",
  //  "BlockQuote", "CKFinder", "EasyImage", "Heading", "Image", "ImageCaption", "ImageStyle",
  //   "ImageToolbar", "ImageUpload", "Link", "List", "MediaEmbed", "Paragraph",
  //    "PasteFromOffice", "Table", "TableToolbar"

  ngOnInit() {
  }

  initial() {
    console.log(this.model.editorData,"editorData")
  }

  MyUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = function( loader ) {
    };
}

}
