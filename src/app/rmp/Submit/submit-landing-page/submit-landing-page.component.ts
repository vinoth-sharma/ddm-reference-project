import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;
import { Router } from "@angular/router";
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';

import { NgToasterComponent } from "../../../custom-directives/ng-toaster/ng-toaster.component";
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service";
declare var jsPDF: any;
import Utils from '../../../../utils';

@Component({
  selector: 'app-submit-landing-page',
  templateUrl: './submit-landing-page.component.html',
  styleUrls: ['./submit-landing-page.component.css']
})
export class SubmitLandingPageComponent implements OnInit, AfterViewInit {

  public closeModal;
  public naming: string = "Loading";
  public message: string;
  public check: boolean;
  public contentForm; // conflicting variable for test case
  public loading: boolean = false;
  public textChange: boolean = false;
  public editMode: Boolean;
  public description_text = {
    "ddm_rmp_desc_text_id": 3,
    "module_name": "Submit Request",
    "description": ""
  };

  public description_text_disclaimer = {
    "ddm_rmp_desc_text_id": 15,
    "module_name": "Disclaimer",
    "description": ""
  }

  public date: any;
  public discMandate: any;
  public finalData = {
    'disclaimer_ack': ""
  };
  public saved_timestamp: any;
  public disclaimer_timestamp: any;
  public saved_date: string;
  public disclaimer_message: string;
  public disclaimer_date: string;
  public saved;
  public original_content;
  public pdfGenerationProgress: number;

  public contents;
  public enable_edits: boolean = false
  public editModes: boolean = false;
  public editModes_disc: boolean = false;
  public readOnlyContent: boolean = true;
  public readOnlyContentDisclaimer: boolean = true;
  public readOnlyContentHelper: boolean = true;
  public original_contents: any;
  public original_contents_disclaimer: any;
  public namings: string = "Loading";
  public naming_disclaimer: string = "Loading";
  public check_disclaimer_status: boolean = false;
  public check_saved_status: boolean;
  public enableUpdateData = false;

  public parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public description_texts = {
    "ddm_rmp_desc_text_id": 14,
    "module_name": "Help_SubmitRequest",
    "description": ""
  }

  public content_disc: any;
  public enable_edit_disc: boolean = false
  public editModess: boolean = false;
  public original_content_disc: any;
  public namingss: string = "Loading";

  public parentsSubjectss: Rx.Subject<any> = new Rx.Subject();
  public description_textss = {
    "ddm_rmp_desc_text_id": 15,
    "module_name": "Disclaimer",
    "description": ""
  }
  public user_role: string;
  public today: string;

  public config = {
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

  public toolbarTooltips = {
    'font': 'Select a font',
    'size': 'Select a font size',
    'header': 'Select the text style',
    'bold': 'Bold',
    'italic': 'Italic',
    'underline': 'Underline',
    'strike': 'Strikethrough',
    'color': 'Select a text color',
    'background': 'Select a background color',
    'script': {
      'sub': 'Subscript',
      'super': 'Superscript'
    },
    'list': {
      'ordered': 'Numbered list',
      'bullet': 'Bulleted list'
    },
    'indent': {
      '-1': 'Decrease indent',
      '+1': 'Increase indent'
    },
    'direction': {
      'rtl': 'Text direction (right to left | left to right)',
      'ltr': 'Text direction (left ro right | right to left)'
    },
    'align': 'Text alignment',
    'link': 'Insert a link',
    'image': 'Insert an image',
    'formula': 'Insert a formula',
    'clean': 'Clear format',
    'add-table': 'Add a new table',
    'table-row': 'Add a row to the selected table',
    'table-column': 'Add a column to the selected table',
    'remove-table': 'Remove selected table',
    'help': 'Show help'
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
    // Conflicting change for test case :: DO NOT DELETE
    //   this.contentForm = new FormGroup({
    //     contentForm: new FormControl()
    //  });
  }

  // execute after html initialized
  public ngAfterViewInit() {
    this.showTooltips();
  }

  // quill editor buttons tooltips display
  public showTooltips() {
    let showTooltip = (which, el) => {
      var tool: any;
      if (which == 'button') {
        tool = el.className.replace('ql-', '');
      }
      else if (which == 'span') {
        tool = el.className.replace('ql-', '');
        tool = tool.substr(0, tool.indexOf(' '));
      }
      if (tool) {
        if (tool === 'blockquote') {
          el.setAttribute('title', 'blockquote');
        }
        else if (tool === 'list' || tool === 'script') {
          if (this.toolbarTooltips[tool][el.value])
            el.setAttribute('title', this.toolbarTooltips[tool][el.value]);
        }
        else if (el.title == '') {
          if (this.toolbarTooltips[tool])
            el.setAttribute('title', this.toolbarTooltips[tool]);
        }
        //buttons with value
        else if (typeof el.title !== 'undefined') {
          if (this.toolbarTooltips[tool][el.title])
            el.setAttribute('title', this.toolbarTooltips[tool][el.title]);
        }
        //defaultlsdfm,nxcm,v vxcn
        else
          el.setAttribute('title', this.toolbarTooltips[tool]);
      }
    };

    let toolbarElement = document.querySelector('.ql-toolbar');
    if (toolbarElement) {
      let matchesButtons = toolbarElement.querySelectorAll('button');
      for (let i = 0; i < matchesButtons.length; i++) {
        showTooltip('button', matchesButtons[i]);
      }
      let matchesSpans = toolbarElement.querySelectorAll('.ql-toolbar > span > span');
      for (let i = 0; i < matchesSpans.length; i++) {
        showTooltip('span', matchesSpans[i]);
      }
    }
  }

  public notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
  }

  public notify_disc() {
    this.enable_edit_disc = !this.enable_edit_disc
    this.parentsSubjectss.next(this.enable_edit_disc)
    this.editModes_disc = true
    $('#edit_button').hide()
  }

  public openDisclaimerModal() {
    document.getElementById('disclaimer-modal').style.overflowY = 'hidden';
  }

  public closeDisclaimerModal() {
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

  public disclaimerNotAcknowledged() {
    $('#disclaimer-modal').modal('show');
    this.disclaimer_message = "Acknowledgement Required";
    $(".disclaimer-checkbox").prop("checked", false);
    $(".disclaimer-checkbox").prop("disabled", true);
    this.report_id_service.changeDisclaimer(false);
    $('#disclaimer-id').prop('disabled', false);
    document.getElementById('text').style.color = "rgb(0, 91, 165)";
    document.getElementById('disclaimer-id').style.backgroundColor = "rgb(1, 126, 17)";
  }

  public disclaimerAcknowledged(date: String) {
    $(".disclaimer-checkbox").prop("checked", true);
    $(".disclaimer-checkbox").prop("disabled", true);
    $('#disclaimer-id').prop('disabled', true);
    this.report_id_service.changeDisclaimer(true);
    this.disclaimer_message = "Disclaimers Acknowledged " + date;
    document.getElementById('text').style.color = "green";
    document.getElementById('disclaimer-id').style.backgroundColor = "gray";
  }

  public textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  public content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      Utils.showSpinner();
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
        $('#helpModal').modal('hide');
        Utils.hideSpinner()
      }, err => {
        Utils.hideSpinner()
        this.toaster.error("Server Error");
      })
    } else {
      this.toaster.error("please enter the data");
    }
  }

  public edit_True() {
    if (this.editModes) {
      this.readOnlyContentHelper = true;
    } else {
      this.readOnlyContentHelper = false;
    }
    this.editModes = !this.editModes;
    this.namings = this.original_contents;
    $('#edit_button').show()
  }

  public content_edit() {
    if (!this.textChange || this.enableUpdateData) {
      Utils.showSpinner()
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
        Utils.hideSpinner();
        this.toaster.success("Data updated");
      }, err => {
        Utils.hideSpinner();
        this.toaster.error("Server Error");
      })
    } else {
      this.toaster.error("please enter the data");
    }
  }

  public editTrue() {
    if (this.editMode) {
      this.readOnlyContent = true;
    } else {
      this.readOnlyContent = false;
    }
    this.editMode = !this.editMode;
    this.naming = this.original_content;
  }


  public content_edit_disclaimer() {
    document.getElementById("disclaimer_button").click();
  }

  public disclaimer_confirmation() {
    if (!this.textChange || this.enableUpdateData) {
      Utils.showSpinner();
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
        $("#disclaimerConfirmationModal").modal("hide");
      }, err => {
        this.toaster.error("Server Error:")
      })
    } else {
      this.toaster.error("please enter the data");
    }
  }

  public edit_True_disclaimer() {
    if (this.editModes_disc) {
      this.readOnlyContentDisclaimer = true;
    } else {
      this.readOnlyContentDisclaimer = false;
    }
    this.editModes_disc = !this.editModes_disc;
    this.naming_disclaimer = this.original_contents_disclaimer;
    $('#edit_button').show()
  }

  public checkDisclaimer() {
    Utils.showSpinner()
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
          Utils.hideSpinner()
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

  public captureScreen() {
    var specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    var doc = new jsPDF();
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