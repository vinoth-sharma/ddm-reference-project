import { Component, OnInit } from '@angular/core';
declare var $: any;
import { Router } from "@angular/router";
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import * as jspdf from '../../../../assets/cdn/jspdf.min.js';
import { NgToasterComponent } from "../../../custom-directives/ng-toaster/ng-toaster.component";
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service";
declare var jsPDF: any;
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-submit-landing-page',
  templateUrl: './submit-landing-page.component.html',
  styleUrls: ['./submit-landing-page.component.css']
})
export class SubmitLandingPageComponent implements OnInit {

  public closeModal;
  naming: string = "Loading";
  message: string;
  check: boolean;
  contentForm;
  loading = false;
  textChange = false;
  editMode: Boolean;
  description_text = {
    "ddm_rmp_desc_text_id": 3,
    "module_name": "Submit Request",
    "description": ""
  };

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
  readOnlyContent = true;
  readOnlyContentDisclaimer = true;
  readOnlyContentHelper = true;
  original_contents;
  original_contents_disclaimer;
  namings: string = "Loading";
  naming_disclaimer = "Loading";
  check_disclaimer_status: boolean = false;
  check_saved_status: boolean;
  enableUpdateData = false;

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

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['image']
    ]
  };

  constructor(private router: Router, private django: DjangoService,
    private DatePipe: DatePipe, private auth_service: AuthenticationService, private dataProvider: DataProviderService,
    private toaster: NgToasterComponent, private report_id_service: GeneratedReportService) {
    this.editMode = false;
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
      }
    })
  // Conflicting change
  //   this.contentForm = new FormGroup({
  //     contentForm: new FormControl()
  //  });
  }

  notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
  }

  notify_disc() {
    this.enable_edit_disc = !this.enable_edit_disc
    this.parentsSubjectss.next(this.enable_edit_disc)
    this.editModes_disc = true
    $('#edit_button').hide()
  }

  openDisclaimerModal() {
    document.getElementById('disclaimer-modal').style.overflowY = 'hidden';
  }

  closeDisclaimerModal() {
    $('#disclaimer-modal').modal('hide');
    document.getElementById('disclaimer-modal').style.overflowY = 'auto';
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
        if (temps) {
          this.original_contents = temps.description;
        }
        else { this.original_contents = "" }
        this.namings = this.original_contents;

        let refs_disclaimer = this.saved['data']['desc_text']
        let temps_disclaimer = refs_disclaimer.find(function (element) {
          return element["ddm_rmp_desc_text_id"] == 15;
        })
        if (temps_disclaimer) {
          this.original_contents_disclaimer = temps_disclaimer.description;
        }
        else { this.original_contents_disclaimer = "" }
        this.naming_disclaimer = this.original_contents_disclaimer;

        var user_list = this.saved.data.users_list;
        var sav = user_list.filter(element => element.users_table_id == this.saved.data['user'])
        this.saved_timestamp = sav[0].saved_setting;
        this.disclaimer_timestamp = sav[0].disclaimer_ack;

        this.saved_date = this.DatePipe.transform(this.saved_timestamp, 'dd-MMM-yyyy')
        this.today = this.DatePipe.transform(new Date(), 'dd-MMM-yyyy')
        this.disclaimer_date = this.DatePipe.transform(this.disclaimer_timestamp, 'dd-MMM-yyyy')
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
        if (!this.disclaimer_date && this.check_disclaimer_status == false) {
          this.disclaimerNotAcknowledged();
        }
        else if (!this.disclaimer_date && this.check_disclaimer_status == true) {
          this.disclaimerAcknowledged(this.today);
        }
        else
          this.disclaimerAcknowledged(this.disclaimer_date);
        let ref = this.saved['data']['desc_text']
        let temp = ref.find(function (element) {
          return element.ddm_rmp_desc_text_id == 3;
        })
        if (temp) {
          this.original_content = temp.description;
        }
        else {
          this.original_content = ""
        }
        this.naming = this.original_content;
      }
    })
  }

  // Not being used
  // navigate() {
  //   this.router.navigate(["/user/main/user-profile"]);
  // }

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
    $(".disclaimer-checkbox").prop("checked", true);
    $(".disclaimer-checkbox").prop("disabled", true);
    $('#disclaimer-id').prop('disabled', true);
    this.report_id_service.changeDisclaimer(true);
    this.disclaimer_message = "Disclaimers Acknowledged " + date;
    document.getElementById('text').style.color = "green";
    document.getElementById('disclaimer-id').style.backgroundColor = "gray";
  }

  textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      // // this.spinner.show()
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_texts['description'] = this.namings;
      $('#edit_button').show()
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {

        let temp_desc_text = this.saved['data']['desc_text'];
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 14) {
            temp_desc_text[index] = this.description_texts;
          }
        })
        this.saved['data']['desc_text'] = temp_desc_text;
        this.dataProvider.changelookUpTableData(this.saved);
        this.editModes = false;
        this.ngOnInit();
        this.original_contents = this.namings;
        this.toaster.success("Updated Successfully");
        // this.spinner.hide()
      }, err => {
        // this.spinner.hide()
        this.toaster.error("Server Error");
      })
    } else {
      this.toaster.error("please enter the data");
    }
  }

  edit_True() {
    if (this.editModes) {
      this.readOnlyContentHelper = true;
    } else {
      this.readOnlyContentHelper = false;
    }
    this.editModes = !this.editModes;
    this.namings = this.original_contents;
    $('#edit_button').show()
  }

  content_edit() {
    if (!this.textChange || this.enableUpdateData) {
      // this.spinner.show()
      this.editMode = false;
      this.readOnlyContent = true;
      $('#edit_button').show();
      this.description_text['description'] = this.naming;
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
        this.original_content = this.naming;
        let temp_desc_text = this.saved['data']['desc_text']
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 3) {
            temp_desc_text[index] = this.description_text
          }
        })
        this.saved['data']['desc_text'] = temp_desc_text
        this.dataProvider.changelookUpTableData(this.saved);
        this.editModes_disc = false;
        this.ngOnInit();
        // this.spinner.hide();
        this.toaster.success("Data updated");
      }, err => {
        // this.spinner.hide();
        this.toaster.error("Server Error");
      })
    } else {
      this.toaster.error("please enter the data");
    }
  }

  editTrue() {
    if (this.editMode) {
      this.readOnlyContent = true;
    } else {
      this.readOnlyContent = false;
    }
    this.editMode = !this.editMode;
    this.naming = this.original_content;
  }


  content_edit_disclaimer() {
    document.getElementById("disclaimer_button").click();
  }

  disclaimer_confirmation() {
    if (!this.textChange || this.enableUpdateData) {
      // this.spinner.show();
      this.editModes_disc = false;
      this.readOnlyContentDisclaimer = true;
      $('#edit_button').show()
      this.description_text_disclaimer['description'] = this.naming_disclaimer;
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_text_disclaimer).subscribe(response => {
        this.original_contents_disclaimer = this.naming_disclaimer;

        let temp_desc_text = this.saved['data']['desc_text']
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 15) {
            temp_desc_text[index] = this.description_text_disclaimer
          }
        })
        this.saved['data']['desc_text'] = temp_desc_text
        this.saved['data']['users_list'].map(element => {
          if (element.users_table_id == this.saved['data']["user"]) {
            element.disclaimer_ack = null;
          }
        })
        this.dataProvider.changelookUpTableData(this.saved)
        this.editModes_disc = false;
        this.ngOnInit();
        this.toaster.success("Updated Successfully");
        // this.spinner.hide();
        $("#disclaimerConfirmationModal").modal("hide");
      }, err => {
        // this.spinner.hide()
        this.toaster.error("Server Error:")
      })
    } else {
      this.toaster.error("please enter the data");
    }
  }

  edit_True_disclaimer() {
    if (this.editModes_disc) {
      this.readOnlyContentDisclaimer = true;
    } else {
      this.readOnlyContentDisclaimer = false;
    }
    this.editModes_disc = !this.editModes_disc;
    this.naming_disclaimer = this.original_contents_disclaimer;
    $('#edit_button').show()
  }

  checkDisclaimer() {
    // this.spinner.show()
    this.django.getLookupValues().subscribe(data => {
      this.saved = data
    })
    this.report_id_service.changeDisclaimer(true)
    if (!this.disclaimer_date) {
      this.finalData["disclaimer_ack"] = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS');
      this.django.user_info_disclaimer(this.finalData).subscribe(response => {
        this.disclaimerAcknowledged(this.today);
        $('#disclaimer-modal').modal('hide');

        this.django.getLookupValues().subscribe(data => {
          this.saved = data
          $('#disclaimer-modal').modal('hide');
          // this.spinner.hide()
          this.toaster.success("Disclaimers Acknowledged")
        })
      }, err => {
        this.toaster.error("Server problem encountered")
      })
    }
    else {
      this.finalData["disclaimer_ack"] = this.DatePipe.transform(this.disclaimer_date, 'yyyy-MM-dd hh:mm:ss.SSS');

    }
  }

  captureScreen() {
    var specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    var doc = new jsPDF();
    // doc.setFont("arial");
    let margins = {
      top: 15,
      bottom: 0,
      left: 18,
      width: 170
    };
    doc.lineHeightProportion = 2;
    doc.fromHTML(
      this.naming_disclaimer, margins.left, margins.top,
      { 'width': 170, 'elementHandlers': specialElementHandlers, 'top_margin': 15 },
      function () { doc.save('DDM Disclaimers.pdf'); }, margins

    )
  }
}