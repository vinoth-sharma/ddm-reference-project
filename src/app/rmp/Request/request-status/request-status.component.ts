import { Component, OnInit } from '@angular/core';
// import $ from 'jquery';
declare var $: any;
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { NgxSpinnerService } from "ngx-spinner";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import { RepotCriteriaDataService } from "../../services/report-criteria-data.service";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { Router } from "@angular/router";
import { element } from '@angular/core/src/render3/instructions';
import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
import { ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as Rx from "rxjs";
import { DataProviderService } from "src/app/rmp/data-provider.service";


@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.css']
})
export class RequestStatusComponent implements OnInit {

  public searchText;
  public p;
  public changeDoc;
  public divDataSelected;
  public printDiv;
  public captureScreen;
  public changeReportMessage;
  public param = "open_count";
  public orderType = 'desc';

  user_info_id: number = 1;
  obj = {}
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  report: any;
  column: string[];
  reports: any;
  report_ids: any;
  created_on: any;
  title: any;
  assigned: any;
  status_date: any;
  status: any;
  user: any;
  links: any;
  behalf: any;
  query: any;
  cancel = {};
  date: String;
  finalData = []
  sorted_by: any;
  count: any;
  item_per_page: any;
  page_num: any;
  comment_list: Array<object> = []
  summary: any;

  document_detailsEdit = {}
  cancel_report = {
    "cancel_reports": []
  }

  accept_report = {
    "accept_reports": []
  }

  add_link: { 'report_id': number; "link_title": string; "link_to_results": string; };
  edit_link: { 'report_id': number; "link_title": string; "link_to_results": string; };

  active_report_id_enter_comment: number;

  collection = [];
  status_reports: any;
  id_get: any;
  user_id: any;

  public Editor = ClassicEditor;
  contents;
  enable_edits = false
  editModes = false;
  original_contents;
  namings: string = "Loading";
  lookup;

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
    description_texts = {
      "ddm_rmp_desc_text_id": 13,
      "module_name": "Help_RequestStatus",
      "description": ""
    }

    notify(){
      this.enable_edits = !this.enable_edits
      this.parentsSubject.next(this.enable_edits)
      this.editModes = true
    }

  constructor(private generated_id_service: GeneratedReportService, private router: Router, private reportDataService: RepotCriteriaDataService,
    private django: DjangoService, private DatePipe: DatePipe, private spinner: NgxSpinnerService,
    private dataProvider: DataProviderService) {

      this.lookup = dataProvider.getLookupTableData();

    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }

    this.sorted_by = "asc";

    $(document).ready(function () {
      $('.ok-btn').prop('disabled', true);
      $('.text-to-display-input').keyup(function () {
        if ($(this).val() != '') {
          $('.ok-btn').prop("disabled", false);
        }
        else {
          $('.ok-btn').prop('disabled', true);
        }
      });
    });

    $(document).ready(function () {
      $('.address-open-button').prop('disabled', true);
      $('.address-text').keyup(function () {
        if ($(this).val() != '') {
          $('.address-open-button').prop("disabled", false);
        }
        else {
          $('.address-open-button').prop('disabled', true);
        }
      });
    });
  }

  

  ngOnInit() {


    let refs = this.lookup['data']['desc_text']
    let temps = refs.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 13;
    })
    this.original_contents = temps.description;
    this.namings = this.original_contents;


    // this.generated_id_service.changeUpdate(false)

    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    this.spinner.show()
    this.obj = { 'user_info_id': this.user_info_id, 'sort_by': '', 'page_no': 1, 'per_page': 200 }
    this.django.list_of_reports(this.obj).subscribe(list => {
      console.log(list);
      // //console.log(list);
      this.reports = list["report_list"]
      this.count = list['report_list']
      this.item_per_page = list['report_list']
      this.page_num = list['report_list']
      // //console.log(this.reports)
      this.spinner.hide()
    })
    this.report = this.report

  }

  content_edits(){
    this.spinner.show()
    this.editModes = false;
    this.description_texts['description'] = this.namings;
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {
      // console.log("inside the service")
      // console.log(response);
      this.original_contents = this.namings;
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  edit_True() {
    this.editModes = !this.editModes;
    this.namings = this.original_contents;
  }

  public onChanges({ editor }: ChangeEvent) {
    const data = editor.getData();
    // console.log( data );
  }

  sort(typeVal) {
    this.param = typeVal.toLowerCase().replace(/\s/g, "_");;
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
  }

  Report_request(event, eve) {
    console.log(event)
    if (eve.target.checked) {
      this.cancel = event.ddm_rmp_post_report_id;

      this.finalData.push(event);

    }
    else {
      for (var i = 0; i < this.finalData.length; i++) {
        console.log('call')
        if (this.finalData[i].ddm_rmp_post_report_id == eve.target.id) {
          console.log('inside if')
          var index = this.finalData.indexOf(this.finalData[i]);
          this.finalData.splice(index, 1);
        }
      }
    }
    if (this.finalData.length == 1) {
      localStorage.setItem('request_status_report_id', this.finalData[0].ddm_rmp_post_report_id)
      console.log(localStorage.getItem('request_status_report_id'))
    }
    console.log(this.finalData);
  }

  open(event, element) {
    this.id_get = element.ddm_rmp_post_report_id
    this.user_id = element.ddm_rmp_user_info
    this.reportDataService.setReportID(this.id_get);
    this.reportDataService.setUserId(this.user_id);
    this.generated_id_service.changeUpdate(true)
  }

  DealerAllocation(event) {
  }

  OrderToSale(event) {

  }

  Cancel() {
    var i = 0;
    this.finalData.forEach(ele => {
      if (ele.status == "Cancelled") {
        i++
        alert('status for this' + ele.ddm_rmp_post_report_id + 'is already cancelled')
      }
    })
    if (i > 0) {
      //alert('chal be')
    } else {
      var checked_boxes = $(".report_id_checkboxes:checkbox:checked").length
      if (checked_boxes >= 1) {
        this.spinner.show()
        this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
        this.finalData.map(element => {
          this.cancel_report.cancel_reports.push({ 'report_id': element['ddm_rmp_post_report_id'], 'status': "Cancelled", 'status_date': this.date })
        })

        //console.log(this.cancel_report)
        this.django.cancel_report(this.cancel_report).subscribe(response => {
          this.obj = { 'user_info_id': this.user_info_id, 'sort_by': '', 'page_no': 1, 'per_page': 6 }
          this.django.list_of_reports(this.obj).subscribe(list => {
            this.reports = list["report_list"]
            this.spinner.hide()
            this.finalData = []
          })
        })
      }
      else if (checked_boxes == 0) {
        alert("Select a report to Cancel")
      }
    }
  }

  sort_by() {
    this.spinner.show()
    if (this.sorted_by == "asc") {
      this.sorted_by = "desc";
    } else if (this.sorted_by == "desc") {
      this.sorted_by = "asc";
    }
    this.obj = { 'user_info_id': this.user_info_id, 'sort_by': this.sorted_by, 'page_no': 1, 'per_page': 6 }

    this.django.list_of_reports(this.obj).subscribe(list => {
      // //console.log(list);
      this.reports = list["report_list"]
      // //console.log(this.reports)
      this.spinner.hide()

    })
    this.report = this.report
    // //console.log('sort by call')
  }

  Accept() {
    var i = 0;
    this.finalData.forEach(ele => {
      console.log('this is accept')
      if (ele.status == "Cancelled" || ele.status == "Active" || ele.status == "Pending-Incomplete") {
        i++
        alert('status for this ' + ele.ddm_rmp_post_report_id + ' is already Cancelled or Active and can not be accepted')
      }
    })
    if (i > 0) {
    } else {

      var checked_boxes = $(".report_id_checkboxes:checkbox:checked").length
      if (checked_boxes >= 1) {
        this.spinner.show()
        this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
        this.finalData.map(element => {
          this.accept_report.accept_reports.push({ 'report_id': element['ddm_rmp_post_report_id'], 'assign_to': 'Jacqueline Cook Beiter', 'status_date': this.date, 'status': 'Active' })
        })
        console.log(this.accept_report)
        console.log(this.finalData)
        //console.log(element)
        this.django.accept_report(this.accept_report).subscribe(response => {
          this.finalData.forEach(element => {
            this.obj = { 'user_info_id': this.user_info_id, 'sort_by': '', 'page_no': 1, 'per_page': 6 }
            this.django.list_of_reports(this.obj).subscribe(list => {
              this.reports = list["report_list"]
              this.spinner.hide()
              this.finalData = []
            })
          });
        })
      }
      else if (checked_boxes == 0) {
        alert("Select a report to Accept")
      }
    }

  }

  xlsxJson() {
    xlsxPopulate.fromBlankAsync().then(workbook => {
      const EXCEL_EXTENSION = '.xlsx';
      const wb = workbook.sheet("Sheet1");
      const headings = Object.keys(this.reports[0]);
      headings.forEach((heading, index) => {
        const cell = `${String.fromCharCode(index + 65)}1`;
        wb.cell(cell).value(heading)
      });
      //console.log() 
      const transformedData = this.reports.map(item => (headings.map(key => item[key] instanceof Array ? item[key].join(",") : item[key])))
      const colA = wb.cell("A2").value(transformedData);

      workbook.outputAsync().then(function (blob) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          //If IE, you must use a diffrent method 
          window.navigator.msSaveOrOpenBlob(blob,
            "Reports" + new Date().getTime() + EXCEL_EXTENSION
          );
        }
        else {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = "Reports" + new Date().getTime() + EXCEL_EXTENSION;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a)
        }
      })
    })
  }

  addDocument() {
    var checked_boxes = $(".report_id_checkboxes:checkbox:checked").length
    if (checked_boxes >= 1) {
      this.spinner.show()

      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      this.finalData.map(element => {
        this.edit_link = { 'report_id': element['ddm_rmp_post_report_id'], "link_title": document_title, "link_to_results": document_url }
      })

      this.spinner.show()
      this.django.post_link(this.edit_link).subscribe(response => {
        this.finalData.forEach(element => {
          this.obj = { 'user_info_id': this.user_info_id, 'sort_by': '', 'page_no': 1, 'per_page': 6 }
          this.django.list_of_reports(this.obj).subscribe(list => {
            this.reports = list["report_list"]
            this.spinner.hide()
            this.finalData = []
          })
        });
      })



    }
    else if (checked_boxes == 0) {
      alert("Select a report to post a link")
    }


  }


  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }

  checkbox_validation() {
    var checked_boxes = $(".report_id_checkboxes:checkbox:checked").length

    if (checked_boxes > 1) {
      alert("You cannot comment on multiple reports at once")
    }
    else if (checked_boxes == 0) {
      alert("Select a report to comment on it")
    }
    else if (checked_boxes == 1) {
      $("#enter_comment_button:button").trigger('click')
      $(".report_id_checkboxes:checkbox:checked").each(function () {
        var $this = $(this);
        if ($this.is(":checked")) {
          this.active_report_id_enter_comment = +($this.attr("id"))
        }
      });
    }
  }

  extract_comment() {
    let comment_text = (<HTMLTextAreaElement>document.getElementById("comment")).value
    if (comment_text == "") {
      alert("Enter some comment");
    }
    else{

      let report_comment = {
        "comment": comment_text,
        'ddm_rmp_post_report': 0,
        "ddm_rmp_user_info": this.user_info_id,
      }
      $(".report_id_checkboxes:checkbox:checked").each(function (django: DjangoService, spinner: NgxSpinnerService) {
        var $this = $(this);
        if ($this.is(":checked")) {
          this.active_report_id_enter_comment = +($this.attr("id"))
          report_comment.ddm_rmp_post_report = this.active_report_id_enter_comment
        }
      });
      this.spinner.show()
      this.django.post_report_comments(report_comment).subscribe(response => {
        this.comment_list.push(response['data']);
        (<HTMLTextAreaElement>document.getElementById("comment")).value = "";
        this.spinner.hide()
      }, err => {
        alert("Please post the comment again")
        this.spinner.hide()
      })
    }
  }

  set_report_comments(report_id) {
    this.spinner.show()
    let accordion_id = "#accordion" + report_id
    //console.log(accordion_id)
    //console.log($(accordion_id).hasClass('show'))
    if ($(accordion_id).hasClass('collapse')) {
      this.django.get_report_comments(report_id).subscribe(response => {
        //console.log(response)
        this.comment_list = response['comments']
        this.spinner.hide()
      }, err => {
        this.spinner.hide()
      })
    }
    else if ($(accordion_id).hasClass('in'))
    // if($(accordion_id).hasClass('in'))
    {
      this.spinner.hide()
    }
  }

  query_criteria_click(query_report_id) {
    this.spinner.show()
    this.django.get_report_description(query_report_id, 1).subscribe(response => {
      this.summary = response
      // console.log(response)
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  NewReportOnSelectedCriteria() {
    localStorage.removeItem("report_id")
    var checkbox_length = $(".report_id_checkboxes:checkbox:checked").length;
    if (checkbox_length < 1) {
      alert("Select atleast one report")
    }
    else if (checkbox_length > 1) {
      alert("Can select only one report for generating new report with same criteria")
    }
    else {
      var i = 0
      this.finalData.forEach(ele => {
        if (ele.status == "Pending-Incomplete") {
          this.reportDataService.setReportID($(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
          this.router.navigate(["user/submit-request/select-report-criteria"]);
          this.generated_id_service.changeUpdate(true)
        }
        else {
          this.generated_id_service.changeUpdate(false)
          this.reportDataService.setReportID($(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
          this.router.navigate(["user/submit-request/select-report-criteria"]);
        }
      })
    }
  }
}



