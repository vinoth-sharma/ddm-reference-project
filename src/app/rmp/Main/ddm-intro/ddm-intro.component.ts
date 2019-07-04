import { Component, OnInit, Input ,AfterViewInit} from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';  //CKEDITOR CHANGE 
import { NgxSpinnerService } from "ngx-spinner";
import * as Rx from "rxjs";
import * as $ from "jquery";
import { AuthenticationService } from "src/app/authentication.service";
import * as jspdf from '../../../../assets/cdn/jspdf.min.js';
import html2canvas from 'html2canvas';
import {PdfUtility} from '../../Main/pdf-utility';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-ddm-intro',
  templateUrl: './ddm-intro.component.html',
  styleUrls: ['./ddm-intro.component.css']
})
export class DdmIntroComponent implements OnInit,AfterViewInit {
  public Editor = ClassicEditor;  //CKEDITOR CHANGE 
  private editor;                 //CKEDITOR CHANGE 
  content;
  @Input() editorData;            //CKEDITOR CHANGE 
  original_content;
  naming: string = "Loading";
  editMode: Boolean;
  description_text = {
    "ddm_rmp_desc_text_id": 1,
    "module_name": "What is DDM",
    "description": ""
  }
  //To print the contents on the page
  restorepage: any;
  printcontent: any;


  contents;
  enable_edits = false
  editModes = false;
  original_contents;
  namings: string = "Loading";

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
    description_texts = {
      "ddm_rmp_desc_text_id": 5,
      "module_name": "Help_WhatIsDDM",
      "description": ""
    }

  user_role : string;
  public editorConfig = { //CKEDITOR CHANGE
    fontFamily : {
      options : [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Times New Roman, Times, serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    removePlugins : ['ImageUpload','ImageButton','MediaEmbed'],
    fontSize : {
      options : [
        9,11,13,'default',17,19,21,23,24
      ]
    },
    // extraPlugins: [this.MyUploadAdapterPlugin]
  };
  public editorHelpConfig = { //CKEDITOR CHANGE
    fontFamily : {
      options : [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Times New Roman, Times, serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    removePlugins : ['ImageUpload','ImageButton','Link','MediaEmbed'],
    fontSize : {
      options : [
        11,13,'default',17,19,21
      ]
    }
    // extraPlugins: [this.MyUploadAdapterPlugin]
  };
  editorHelp: any;
  pdfGenerationProgress: number;
  
  constructor(private django: DjangoService,private auth_service : AuthenticationService, private toastr: ToastrService ,private dataProvider: DataProviderService, private spinner: NgxSpinnerService) {
    this.editMode = false;
    dataProvider.currentlookUpTableData.subscribe(element=>{
      if (element) {
        this.content = element
      }
    })
    this.auth_service.myMethod$.subscribe(role =>{
      if (role) {
        this.user_role = role["role"]
        if (this.user_role != 'Admin') {
          this.editorConfig.removePlugins = ['ImageUpload','Iframe','Save','toolbar']
        }
      }
    })
    // var $ : any;
    //       $.fn.modal.Constructor.prototype.enforceFocus = function() {
    //         var $modalElement = this.$element
    //         $(document).on('focusin.modal', function (e) {
    //           var $parent = $(e.target.parentNode);
    //           if ($modalElement[0] !== e.target && !$modalElement.has(e.target).length
    //           && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select')
    //           && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
    //             $modalElement.focus()
    //           }
    //         })
    //           }
    
      }

  //CKEDITOR CHANGE START
  ngAfterViewInit() {
    ClassicEditor.create(document.querySelector('#ckEditor'), this.editorConfig).then(editor => {
      this.editor = editor;
      //console.log('Data: ', this.editorData);
      this.editor.setData(this.naming);
      this.editor.isReadOnly = true;
      // ClassicEditor.builtinPlugins.map(plugin => //console.log(plugin.pluginName))
    })
      .catch(error => {
        //console.log('Error: ', error);
      });
    ClassicEditor.create(document.querySelector('#ckEditorHelp'), this.editorHelpConfig).then(editor => {
      this.editorHelp = editor;
      //console.log('Data: ', this.editorData);
      this.editorHelp.setData(this.namings);
      this.editorHelp.isReadOnly = true;
      // ClassicEditor.builtinPlugins.map(plugin => //console.log(plugin.pluginName))
    })
      .catch(error => {
        //console.log('Error: ', error);
      });
  }
  //CKEDITOR CHANGE END

  notify(){
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  ngOnInit() {

    this.spinner.show();
    this.dataProvider.currentlookUpTableData.subscribe(element=>{
      if (element) {
        this.content = element
      }
    })
    let ref = this.content['data']['desc_text']
    let temp = ref.find(function (element) {
      return element.ddm_rmp_desc_text_id == 1;
    })
    this.original_content = temp.description;
    this.naming = this.original_content


    let refs = this.content['data']['desc_text']
    let temps = refs.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 5;
    })
    this.original_contents = temps.description;
    this.namings = this.original_contents;
    this.spinner.hide()
  }


  content_edits(){
    this.spinner.show()
    this.editModes = false;
    this.editorHelp.isReadOnly = true;  //CKEDITOR CHANGE
    this.description_texts["description"] = this.editorHelp.getData()
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {

      let temp_desc_text = this.content['data']['desc_text']
      temp_desc_text.map((element,index)=>{
        if(element['ddm_rmp_desc_text_id']==5){
          temp_desc_text[index] = this.description_texts
        }
      })
      this.content['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.content)  
      //console.log("changed")    
      this.editModes = false;
      this.ngOnInit()
      this.original_contents = this.namings;
      this.editorHelp.setData(this.namings)
      this.toastr.success("Updated Successfully");
      this.spinner.hide();
    }, err => {
      this.toastr.error("Server Error");
      this.spinner.hide();
    })
  }

  edit_True() {

    if(this.editModes){
      this.editorHelp.isReadOnly = true; 
    }
    else{
      this.editorHelp.isReadOnly = false;
    }
    this.editModes = !this.editModes;
    this.namings = this.original_contents;
    this.editorHelp.setData(this.namings);
    $('#edit_button').show()
  }

  // public onChanges({ editor }: ChangeEvent) {
  //   const data = editor.getData();
  //   // //console.log( data );
  // }


  content_edit() {
    this.spinner.show()
    this.editMode = false;
    this.editor.isReadOnly = true;  //CKEDITOR CHANGE
    this.description_text["description"] = this.editor.getData()   //CKEDITOR CHANGE 
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
      let temp_desc_text = this.content['data']['desc_text']
      temp_desc_text.map((element,index)=>{
        if(element['ddm_rmp_desc_text_id']==1){
          temp_desc_text[index] = this.description_text
        }
      })
      this.content['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.content)
      this.ngOnInit()
      this.original_content = this.naming;
      this.editor.setData(this.naming)
      this.toastr.success("Updated Successfully");
      this.spinner.hide();
    }, err => {
      this.toastr.error("Server Error");
      this.spinner.hide();
    })
  }



  editTrue() {
    //CKEDITOR CHANGE START
    if(this.editMode){
      this.editor.isReadOnly = true; 
    }
    else{
      this.editor.isReadOnly = false;
    }
    this.editMode = !this.editMode;
    this.naming = this.original_content;
    this.editor.setData(this.naming);
    //CKEDITOR CHANGE START
  }

  printDiv() {
    this.restorepage = document.body.innerHTML;
    this.printcontent = this.naming;
    document.body.innerHTML = this.printcontent;
    window.print();
    document.body.innerHTML = this.restorepage;
    location.reload(true);
  }

  // public onChange({ editor }: ChangeEvent) {
  //   const data = editor.getData();
  //   // //console.log( data );
  // }

  //============================================Pdf function=====================================//
  captureScreen() {
    var data = document.getElementById('JJ');
    //console.log(data);
    html2canvas(data).then(canvas => {
      var imageWidth = 208;
      var pageHeight = 295;
      var imageHeight = canvas.height * imageWidth / canvas.width;
      var heightLeft = imageHeight;
      this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      //console.log('Canvas', contentDataURL);
      pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        pdf.addPage();
        //console.log('Adding page');
        pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
        this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
        heightLeft -= pageHeight;
      }
      //console.log('pdf: ', pdf);
      PdfUtility.saveBlob(pdf.output('blob'), 'DDM Introductions.pdf');
     // pdf.save('Request #' + this.generated_report_id + '.pdf');
    }).catch(error => {
      //console.log(error);
    });
  }


}