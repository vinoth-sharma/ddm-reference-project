import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Editor } from 'brace';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';  // <--- ADDED

@Component({
  selector: 'app-show-signature',
  templateUrl: './show-signature.component.html',
  styleUrls: ['./show-signature.component.css']
})
export class ShowSignatureComponent implements OnInit, AfterViewInit {

  public Editor = ClassicEditor;
  public model = {
    editorData: '<p>Hello, world!</p>'
  };
  public editorConfig = {
    extraPlugins: [ this.MyUploadAdapterPlugin],
    alignment : {
      options : [ 'left','right', 'center', 'justify']
    },
    // table : {
    //   contentToolbar : ['tableColumn', 'tableRow', 'mergeTableCells']
    // },
    fontFamily : {
      options : [ 'sans-serif', 'monospace']
    },
    toolbar: [
      "Essentials",
      "underline",
      "Strikethrough",
      "Subscript",
      "Superscript",
      "bold",
      "italic",
      "alignment: left ",
      "blockQuote",
      "heading",
      "imageUpload",
      "link",
      "bulletedList",
      "numberedList",
      "mediaEmbed",
      "ImageUpload",
      "ImageToolbar",
      "EasyImage",
      "Image",
      "Table",
      "TableToolbar",
      "insertTable",
    "ImageCaption",
    "ImageStyle",
    "List",
    "highlight",
    "fontFamily"
    ]
  };
  constructor() {
  }



  // "Essentials", "CKFinderUploadAdapter", "Autoformat", "Bold", "Italic",
  //  "BlockQuote", "CKFinder", "EasyImage", "Heading", "Image", "ImageCaption", "ImageStyle",
  //   "ImageToolbar", "ImageUpload", "Link", "List", "MediaEmbed", "Paragraph",
  //    "PasteFromOffice", "Table", "TableToolbar"

  ngAfterViewInit() {
    ClassicEditor.create(document.querySelector('#ckeditor'), this.editorConfig)
      .catch(error => {
        console.log(error);
      });
    // const plugins = ClassicEditor.builtinPlugins;
    const plugins = ClassicEditor.builtinPlugins.map( plugin =>  plugin.pluginName)
    // console.log('Plugins', plugins);

  }

  ngOnInit() {

    //  this.Editor.editorConfig = function( config ) {
    //   config.toolbarGroups = [
    //   { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
    //   { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
    //   { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
    //   { name: 'forms', groups: [ 'forms' ] },
    //   '/',
    //   { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    //   { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
    //   { name: 'links', groups: [ 'links' ] },
    //   { name: 'insert', groups: [ 'insert' ] },
    //   '/',
    //   { name: 'styles', groups: [ 'styles' ] },
    //   { name: 'colors', groups: [ 'colors' ] },
    //   { name: 'tools', groups: [ 'tools' ] },
    //   { name: 'others', groups: [ 'others' ] },
    //   { name: 'about', groups: [ 'about' ] }
    //   ];
    //   };

  }


  MyUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = function( loader ) {
    };
}

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    console.log(data,"sdfdfasrfgver");
  }

}
