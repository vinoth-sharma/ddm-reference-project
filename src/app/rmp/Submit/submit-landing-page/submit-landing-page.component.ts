import { Component, OnInit, AfterViewInit } from '@angular/core';
//import $ from 'jquery';
declare var $: any;
import { Router } from "@angular/router";
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import * as jspdf from '../../../../assets/cdn/jspdf.min.js';
import html2canvas from 'html2canvas';
import { ToastrService } from "ngx-toastr";
// import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
// import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as Rx from "rxjs";
import { PdfUtility } from '../../Main/pdf-utility';
import { AuthenticationService } from "src/app/authentication.service";
import { element } from '@angular/core/src/render3/instructions';
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';  //CKEDITOR CHANGE 

@Component({
  selector: 'app-submit-landing-page',
  templateUrl: './submit-landing-page.component.html',
  styleUrls: ['./submit-landing-page.component.css']
})
export class SubmitLandingPageComponent implements OnInit,AfterViewInit {

  public Editor = ClassicEditor;
  public closeModal;
  naming: string = "Loading";
  message: string;
  check: boolean;
  contentForm;
  loading = false
  editMode: Boolean;
  description_text = {
    "ddm_rmp_desc_text_id": 3,
    "module_name": "Submit Request",
    "description": ""
  }

  description_text_disclaimer = {
    "ddm_rmp_desc_text_id": 15,
    "module_name": "Disclaimer",
    "description": ""
  }

  date: any;
  discMandate;
  finalData = {
    'disclaimer_ack': ""
  };
  public editorConfig = {            //CKEDITOR CHANGE
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
    removePlugins : ['ImageUpload','ImageButton','MediaEmbed','Iframe','Save'],
    fontSize : {
      options : [
        9,11,13,'default',17,19,21,23,24
      ]
    }
  };
  public editorHelpConfig = {            //CKEDITOR CHANGE 
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
    removePlugins : ['ImageUpload','ImageButton','Link','MediaEmbed','Iframe','Save'],
    fontSize : {
      options : [
        9,11,13,'default',17,19,21,23,24
      ]
    }
  };
  saved_timestamp: any;
  disclaimer_timestamp: any;
  saved_date: string;
  disclaimer_message: string;
  disclaimer_date: string;
  saved;
  original_content;
  pdfGenerationProgress: number;

  contents;
  enable_edits = false
  editModes = false;
  editModes_disc = false;
  original_contents;
  original_contents_disclaimer;
  namings: string = "Loading";
  naming_disclaimer = "Loading";
  check_disclaimer_status: boolean = false;
  check_saved_status: boolean;

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  description_texts = {
    "ddm_rmp_desc_text_id": 14,
    "module_name": "Help_SubmitRequest",
    "description": ""
  }

  content_disc;
  enable_edit_disc = false
  editModess = false;
  original_content_disc;
  namingss: string = "Loading";

  parentsSubjectss: Rx.Subject<any> = new Rx.Subject();
  description_textss = {
    "ddm_rmp_desc_text_id": 15,
    "module_name": "Disclaimer",
    "description": ""
  }
  user_role: string;
  today: string;
  editor: any;
  editorHelp: any;
  editorDisc: any;

  constructor(private router: Router, private django: DjangoService,
    private DatePipe: DatePipe, private auth_service: AuthenticationService, private spinner: NgxSpinnerService, private dataProvider: DataProviderService,
    private toastr: ToastrService, private report_id_service: GeneratedReportService) {
    this.editMode = false;
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
      }
    })
  }

  notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    // $('#edit_button').hide()
  }

  notify_disc() {
    this.enable_edit_disc = !this.enable_edit_disc
    this.parentsSubjectss.next(this.enable_edit_disc)
    this.editModes_disc = true
    $('#edit_button').hide()
  }

  closeDisclaimerModal() {
    $('#disclaimer-modal').modal('hide');
  }

  ngOnInit() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.saved = element
        this.report_id_service.currentSaved.subscribe(saved_status => {
          this.check_saved_status = saved_status
        })
        this.report_id_service.currentDisclaimer.subscribe(disclaimer_status => {
          this.check_disclaimer_status = disclaimer_status
        })
        let refs = this.saved['data']['desc_text']
        let temps = refs.find(function (element) {
          return element["ddm_rmp_desc_text_id"] == 14;
        })
        if(temps){
          this.original_contents = temps.description;
        }
        else { this.original_contents = ""}
        this.namings = this.original_contents;
    
        let refs_disclaimer = this.saved['data']['desc_text']
        let temps_disclaimer = refs_disclaimer.find(function (element) {
          return element["ddm_rmp_desc_text_id"] == 15;
        })
        if(temps_disclaimer){
          this.original_contents_disclaimer = temps_disclaimer.description;
        }
        else{ this.original_contents_disclaimer = ""}
        this.naming_disclaimer = this.original_contents_disclaimer;
    
        var user_list = this.saved.data.users_list;
        // // console.log(this.saved)
        // // console.log(user_list);
        var sav = user_list.filter(element => element.users_table_id == this.saved.data['user'])
        // // console.log(sav);
    
        this.saved_timestamp = sav[0].saved_setting;
        this.disclaimer_timestamp = sav[0].disclaimer_ack;
    
        this.saved_date = this.DatePipe.transform(this.saved_timestamp, 'dd-MMM-yyyy')
        this.today = this.DatePipe.transform(new Date(), 'dd-MMM-yyyy')
        this.disclaimer_date = this.DatePipe.transform(this.disclaimer_timestamp, 'dd-MMM-yyyy')
        // // console.log("Date is")
        // // console.log(this.disclaimer_timestamp);
        //**********************Check for Saved Settings******************* */
        if (!this.saved_date && this.check_saved_status == false) {
          this.message = "No Saved Settings";
          $(".saved-checkbox").prop("checked", false);
          $(".saved-checkbox").prop("disabled", true);
        }
        else if (this.check_saved_status == true) {
          this.message = "Settings Saved" + " " + this.today;
          document.getElementById('saved-settings-text').style.color = "green";
          $(".saved-checkbox").prop("checked", true);
          $(".saved-checkbox").prop("disabled", true);
        }
        else {
          this.message = "Settings Saved" + " " + this.saved_date;
          document.getElementById('saved-settings-text').style.color = "green";
          $(".saved-checkbox").prop("checked", true);
          $(".saved-checkbox").prop("disabled", true);
        }
        //**********************Check for Disclaimer Acknowledged******************* */
        if (!this.disclaimer_date && this.check_disclaimer_status==false) {
          this.disclaimerNotAcknowledged();
        }
        // else if (this.check_disclaimer_status == true) {
        //   this.disclaimerAcknowledged(this.today);
        // }
        else if (!this.disclaimer_date && this.check_disclaimer_status==true) {
          this.disclaimerAcknowledged(this.today);
        }
        else 
          this.disclaimerAcknowledged(this.disclaimer_date);
        // // console.log("Disclaimer message")
        // // console.log(this.disclaimer_message)
    
    
        let ref = this.saved['data']['desc_text']
        let temp = ref.find(function (element) {
          return element.ddm_rmp_desc_text_id == 3;
        })
        if(temp){
          this.original_content = temp.description;
        }
        else{
          this.original_content = ""
        }
        this.naming = this.original_content;
      }
    })
  }

  ngAfterViewInit() {
    ClassicEditor.create(document.querySelector('#ckEditor'), this.editorConfig).then(editor => {
      this.editor = editor;
      // // console.log('Data: ', this.editorData);
      this.editor.setData(this.naming);
      this.editor.isReadOnly = true;
      // ClassicEditor.builtinPlugins.map(plugin => // console.log(plugin.pluginName))
    })
      .catch(error => {
        // // console.log('Error: ', error);
      });
    ClassicEditor.create(document.querySelector('#ckEditorHelp'), this.editorHelpConfig).then(editor => {
      this.editorHelp = editor;
      // // console.log('Data: ', this.editorData);
      this.editorHelp.setData(this.namings);
      this.editorHelp.isReadOnly = true;
      // ClassicEditor.builtinPlugins.map(plugin => // console.log(plugin.pluginName))
    })
      .catch(error => {
        // // console.log('Error: ', error);
      });
      ClassicEditor.create(document.querySelector('#ckEditorDisc'), this.editorHelpConfig).then(editor => {
        this.editorDisc = editor;
        // // console.log('Data: ', this.editorData);
        this.editorDisc.setData(this.naming_disclaimer);
        this.editorDisc.isReadOnly = true;
        // ClassicEditor.builtinPlugins.map(plugin => // console.log(plugin.pluginName))
      })
        .catch(error => {
          // // console.log('Error: ', error);
        });
  }

  navigate() {
    this.router.navigate(["/user/main/user-profile"]);
  }

  disclaimerNotAcknowledged() {
    $('#disclaimer-modal').modal('show');
    this.disclaimer_message = "Acknowledgement Required";
    $(".disclaimer-checkbox").prop("checked", false);
    $(".disclaimer-checkbox").prop("disabled", true);
    this.report_id_service.changeDisclaimer(false);
    $('#disclaimer-id').prop('disabled', false);
    document.getElementById('text').style.color = "rgb(0, 91, 165)";
    document.getElementById('disclaimer-id').style.backgroundColor = "rgb(1, 126, 17)";
  }

  disclaimerAcknowledged(date: String) {
    // // console.log("checking");
    $(".disclaimer-checkbox").prop("checked", true);
    $(".disclaimer-checkbox").prop("disabled", true);
    $('#disclaimer-id').prop('disabled', true);
    this.report_id_service.changeDisclaimer(true);
    this.disclaimer_message = "Disclaimers Acknowledged " +date;
    document.getElementById('text').style.color = "green";
    document.getElementById('disclaimer-id').style.backgroundColor = "gray";
    //// console.log("Acknowledged Disclaimer notification")
    //// console.log(this.check_disclaimer_status)
  }

  content_edits() {
    this.spinner.show()
    this.editModes = false;
    this.editorHelp.isReadOnly = true
    this.description_texts['description'] = this.editorHelp.getData();
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {

      let temp_desc_text = this.saved['data']['desc_text']
      temp_desc_text.map((element, index) => {
        if (element['ddm_rmp_desc_text_id'] == 14) {
          temp_desc_text[index] = this.description_texts
        }
      })
      this.saved['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.saved)
      // // console.log("changed")
      this.editModes = false;
      this.ngOnInit()
      // // console.log("inside the service")
      // // console.log(response);
      this.original_contents = this.namings;
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  edit_True() {
    if (this.editModes) {
      this.editorHelp.isReadOnly = true;
    } else {
      this.editorHelp.isReadOnly = false;
    }
    this.editModes = !this.editModes;
    this.namings = this.original_contents;
    this.editorHelp.setData(this.namings);
    $('#edit_button').show()
  }

  content_edit() {
    this.spinner.show()
    this.editMode = false;
    this.editor.isReadOnly = true;
    $('#edit_button').show()
    this.description_text['description'] = this.editor.getData();
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
      this.original_content = this.naming;
      let temp_desc_text = this.saved['data']['desc_text']
      temp_desc_text.map((element, index) => {
        if (element['ddm_rmp_desc_text_id'] == 3) {
          temp_desc_text[index] = this.description_text
        }
      })
      this.saved['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.saved)
      this.editModes_disc = false;
      this.ngOnInit()
      // // console.log("inside the service")
      // // console.log(response)
      this.spinner.hide()
      this.toastr.success("Data updated", "Success:")
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server problem encountered", "Error:")
    })
  }

  editTrue() {
    if (this.editMode) {
      this.editor.isReadOnly = true;
    } else {
      this.editor.isReadOnly = false;
    }
    this.editMode = !this.editMode;
    this.naming = this.original_content;
    this.editor.setData(this.naming)
  }


  content_edit_disclaimer() {
    document.getElementById("disclaimer_button").click()
  }
  
  disclaimer_confirmation(){
    this.spinner.show()
    this.editModes_disc = false;
    this.editorDisc.isReadOnly = true
    $('#edit_button').show()
    this.description_text_disclaimer['description'] = this.editorDisc.getData();
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text_disclaimer).subscribe(response => {
      this.original_contents_disclaimer = this.naming_disclaimer;
  
      let temp_desc_text = this.saved['data']['desc_text']
      temp_desc_text.map((element, index) => {
        if (element['ddm_rmp_desc_text_id'] == 15) {
          temp_desc_text[index] = this.description_text_disclaimer
        }
      })
      this.saved['data']['desc_text'] = temp_desc_text
      // disclaimer_ack
      this.saved['data']['users_list'].map(element => {
        if (element.users_table_id == this.saved['data']["user"]) {
          element.disclaimer_ack = null;
        }
      })
      // // console.log(this.saved['data']['users_list'])
      this.dataProvider.changelookUpTableData(this.saved)
      this.editModes_disc = false;
      this.ngOnInit()
      // // console.log("inside the service")
      // // console.log(response)
      this.toastr.success("Data updated", "Success:")
      this.disclaimerNotAcknowledged();
      this.spinner.hide()
      $("#disclaimerConfirmationModal").modal("hide")
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server problem encountered", "Error:")
    })
    
  }

  edit_True_disclaimer() {
    if (this.editModes_disc) {
      this.editorDisc.isReadOnly = true;
    } else {
      this.editorDisc.isReadOnly = false;
    }
    this.editModes_disc = !this.editModes_disc;
    this.naming_disclaimer = this.original_contents_disclaimer;
    this.editorDisc.setData(this.naming_disclaimer)
    $('#edit_button').show()
  }


  checkDisclaimer() {
    this.spinner.show()
    this.django.getLookupValues().subscribe(data => {
      this.saved = data
    })
    // // console.log(this.disclaimer_date)
    this.report_id_service.changeDisclaimer(true)
    if (!this.disclaimer_date) {
      // // console.log("date null")
      // // console.log(this.disclaimer_date)
      // if (true) {
      //this.report_id_service.changeDisclaimer(true)
      this.finalData["disclaimer_ack"] = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS');
      this.django.user_info_disclaimer(this.finalData).subscribe(response => {
        this.disclaimerAcknowledged(this.today);
        // console.log(this.finalData)
        // this.spinner.hide()
        $('#disclaimer-modal').modal('hide');

        this.django.getLookupValues().subscribe(data => {
          this.saved = data
          $('#disclaimer-modal').modal('hide');
          this.spinner.hide()
          this.toastr.success("Disclaimers Acknowledged", "Success:")
        })
        // // console.log(response)
      }, err => {
        this.toastr.error("Server problem encountered", "Error:")
      })
    }
    else {
      //this.report_id_service.changeDisclaimer(true)
      // console.log("date not null")
      // console.log(this.disclaimer_date)
      this.finalData["disclaimer_ack"] = this.DatePipe.transform(this.disclaimer_date, 'yyyy-MM-dd hh:mm:ss.SSS');

    }
  }

  captureScreen() {
    var data = document.getElementById('exportable-container');
    //var data = document.querySelector('#exportable-container .ck-content');
    // console.log(data);
    html2canvas(data).then(canvas => {
      var imageWidth = 208;
      var pageHeight = 295;
      var imageHeight = canvas.height * imageWidth / canvas.width;
      var heightLeft = imageHeight;
      this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      // console.log('Canvas', contentDataURL);
      pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        pdf.addPage();
        // console.log('Adding page');
        pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
        this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
        heightLeft -= pageHeight;
      }
      // console.log('pdf: ', pdf);
      PdfUtility.saveBlob(pdf.output('blob'), 'DDM Disclaimer.pdf');
      // document.body.removeChild(downloadElement);
      // pdf.save('DDM Disclaimer.pdf'); // Generated PDF   
    }).catch(error => {
      // console.log(error);
    });
    ;
  }

}