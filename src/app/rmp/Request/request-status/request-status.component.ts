import { Component, OnInit } from '@angular/core';
declare var $: any;
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { NgxSpinnerService } from "ngx-spinner";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service'
import { RepotCriteriaDataService } from "../../services/report-criteria-data.service";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { Router } from "@angular/router";
import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
import { ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as Rx from "rxjs";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { AuthenticationService } from "src/app/authentication.service";
import { SharedDataService } from '../../../create-report/shared-data.service';


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
  public fieldType = 'string';

  obj = {}
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  report: any;
  column: string[];
  reports: any = null;
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
  user_role : string;

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
    description_texts = {
      "ddm_rmp_desc_text_id": 13,
      "module_name": "Help_RequestStatus",
      "description": ""
    }
  user_name: string;
  notification_list: any[];

    notify(){
      this.enable_edits = !this.enable_edits
      this.parentsSubject.next(this.enable_edits)
      this.editModes = true
      $('#edit_button').hide()
    }

  constructor(private generated_id_service: GeneratedReportService, private router: Router, private reportDataService: RepotCriteriaDataService,
    private django: DjangoService, private DatePipe: DatePipe, private spinner: NgxSpinnerService,private sharedDataService:SharedDataService,
    private dataProvider: DataProviderService, private auth_service:AuthenticationService) {
      this.auth_service.myMethod$.subscribe(role =>{
        if (role) {
          this.user_name = role["first_name"] + "" +role["last_name"]
          this.user_role = role["role"]
        }
      })
      // this.lookup = dataProvider.getLookupTableData();
      dataProvider.currentlookUpTableData.subscribe(element=>{
        if (element) {
          console.log("element")
          console.log(element)
          this.lookup = element
          console.log("Check This")
          console.log(this.lookup)
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
        // this.spinner.show();
    let refs = this.lookup['data']['desc_text']
    this.user_id = this.lookup['data']['user']
    let temps = refs.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 13;
    })
    this.original_contents = temps.description;
    this.namings = this.original_contents;


    // this.generated_id_service.changeUpdate(false)
    console.log("Start")
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    // this.spinner.show();
    this.obj = {'sort_by': '', 'page_no': 1, 'per_page': 200 }
    this.django.list_of_reports(this.obj).subscribe(list => {
      console.log(list);
      //console.log(list);
      this.reports = list["report_list"];
      this.reports.forEach(reportRow => {
        reportRow['ddm_rmp_post_report_id'] = isNaN(+reportRow['ddm_rmp_post_report_id']) ? 99999 : +reportRow['ddm_rmp_post_report_id'];
      });
      this.count = list['report_list']
      this.item_per_page = list['report_list']
      this.page_num = list['report_list']
      console.log(this.reports)
      // this.spinner.hide();
    },err=>{
      // this.spinner.hide()
    })
    this.report = this.report
    console.log(this.report)  
        }  
      })


  }

  

  ngOnInit() {

    

  }

  content_edits(){
    this.spinner.show()
    this.editModes = false;
    this.description_texts['description'] = this.namings;
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {


      let temp_desc_text = this.lookup['data']['desc_text']
      temp_desc_text.map((element,index)=>{
        if(element['ddm_rmp_desc_text_id']==13){
          temp_desc_text[index] = this.description_texts
        }
      })
      this.lookup['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.lookup)  
      console.log("changed")    
      this.editModes = false;
      this.ngOnInit()
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
    $('#edit_button').show()
  }

  public onChanges({ editor }: ChangeEvent) {
    const data = editor.getData();
    // console.log( data );
  }

  sort(typeVal) {
    this.param = typeVal.toLowerCase().replace(/\s/g, "_");
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
    if (['ddm_rmp_post_report_id'].includes(this.param)) {
      this.fieldType = 'number';
    } else {
      this.fieldType = 'string';
    }
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
      localStorage.setItem('report_id', this.finalData[0].ddm_rmp_post_report_id)
      console.log(localStorage.getItem('report_id'))
    }
    console.log(this.finalData);
  }

  open(event, element) {
    this.id_get = element.ddm_rmp_post_report_id
    this.user_id = element.user_id
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
        i++;
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>"+"Request #" + ele.ddm_rmp_post_report_id + " is already cancelled"+"</h5>";
        $('#errorModalRequest').modal('show');
        // alert('Request #' + ele.ddm_rmp_post_report_id + ' is already cancelled')
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
          this.obj = {'sort_by': '', 'page_no': 1, 'per_page': 6 }
          this.django.list_of_reports(this.obj).subscribe(list => {
            this.reports = list["report_list"]
            this.spinner.hide()
            this.finalData = []
          })
        })
      }
      else if (checked_boxes == 0) {
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to Cancel</h5>";
        $('#errorModalRequest').modal('show');
        // alert("Select a report to Cancel")
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
    this.obj = {'sort_by': this.sorted_by, 'page_no': 1, 'per_page': 6 }

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
      if (ele.status == "Cancelled") {
        i++;
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>"+'status for the report '+ ele.ddm_rmp_post_report_id + ' is already Cancelled and can not be accepted'+"</h5>";
        $('#errorModalRequest').modal('show');
        // alert('status for the report ' + ele.ddm_rmp_post_report_id + ' is already Cancelled and can not be accepted')
      }
      else if(ele.status == "Active"){
        i++;
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>"+'status for the report ' + ele.ddm_rmp_post_report_id + ' is already Active and can not be accepted'+"</h5>";
        $('#errorModalRequest').modal('show');
        // alert('status for the report ' + ele.ddm_rmp_post_report_id + ' is already Active and can not be accepted')
      }
      else if(ele.status == "Incomplete"){
        i++;
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>"+'status for the report ' + ele.ddm_rmp_post_report_id + ' is Incomplete and can not be accepted. Please complete the report'+"</h5>";
        $('#errorModalRequest').modal('show');
        // alert('status for the report ' + ele.ddm_rmp_post_report_id + ' is Incomplete and can not be accepted. Please complete the report')
      }
    })
    if (i > 0) {
    } else {

      var checked_boxes = $(".report_id_checkboxes:checkbox:checked").length
      if (checked_boxes >= 1) {
        this.spinner.show()
        this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
        this.finalData.map(element => {
          this.accept_report.accept_reports.push({ 'report_id': element['ddm_rmp_post_report_id'], 'assign_to': this.user_name, 'status_date': this.date, 'status': 'Active' })
        })
        console.log(this.accept_report)
        console.log(this.finalData)
        //console.log(element)
        this.django.accept_report(this.accept_report).subscribe(response => {
          this.finalData.forEach(element => {
            this.obj = {'sort_by': '', 'page_no': 1, 'per_page': 6 }
            this.django.list_of_reports(this.obj).subscribe(list => {
              this.reports = list["report_list"]
              this.spinner.hide()
              this.finalData = []
            })
          });
        })
      }
      else if (checked_boxes == 0) {
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to Accept</h5>";
        $('#errorModalRequest').modal('show');
        // alert("Select a report to Accept")
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
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
    });
  }


  post_link(){

    var i = 0;
    var checked_boxes = $(".report_id_checkboxes:checkbox:checked").length
    if (checked_boxes == 0) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to post link for it</h5>";
      $('#errorModalRequest').modal('show');
      // alert("Select a report to post link for it")
    }
    else if (checked_boxes > 1) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>You cannot post link on multiple reports at once</h5>";
      $('#errorModalRequest').modal('show');
      // alert("You cannot post link on multiple reports at once")
    }
    
    
    else {
    this.finalData.forEach(ele => {
      if (checked_boxes == 1 && ele.status != "Active") {
        i++;
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Request not Active yet. Can't post link to results.</h5>";
        $('#errorModalRequest').modal('show');
        // alert("Request not Active yet. Can't post link to results.")
      }
      else if (checked_boxes == 1 && ele.status == "Active") {
        $("#post_link_button:button").trigger('click')
      }
  })
  }

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
          this.obj = {'sort_by': '', 'page_no': 1, 'per_page': 6 }
          this.django.list_of_reports(this.obj).subscribe(list => {
            this.reports = list["report_list"]
            this.spinner.hide()
            this.finalData = []
          })
        });
      })
    }
    else if (checked_boxes == 0) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to post a link</h5>";
      $('#errorModalRequest').modal('show');
      // alert("Select a report to post a link")
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
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>You cannot comment on multiple reports at once</h5>";
      $('#errorModalRequest').modal('show');
      // alert("You cannot comment on multiple reports at once")
    }
    else if (checked_boxes == 0) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to comment on it</h5>";
      $('#errorModalRequest').modal('show');
      // alert("Select a report to comment on it")
    }
    else if (checked_boxes == 1) {
      (<HTMLTextAreaElement>document.getElementById("comment")).value = ""
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
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Enter some comment</h5>";
      $('#errorModalRequest').modal('show');
      // alert("Enter some comment");
    }
    else{
      
      this.spinner.show()
      let report_comment = {
        'ddm_rmp_post_report': 0,
        "comment" : comment_text,
        "comment_read_flag":false,
        "audience" : "",
        "commentor":this.user_name
      }
      
      $(".report_id_checkboxes:checkbox:checked").each(function (django: DjangoService, spinner: NgxSpinnerService) {
        var $this = $(this);
        if ($this.is(":checked")) {
          this.active_report_id_enter_comment = +($this.attr("id"))
          report_comment.ddm_rmp_post_report = this.active_report_id_enter_comment
        }
      });

      this.reports.forEach(element => {
        console.log("Enter")
        if(element.ddm_rmp_post_report_id == report_comment.ddm_rmp_post_report){
          report_comment["audience"] = element.assigned_to
          console.log("REPORT COMMENTING")
          console.log(report_comment)
    
          this.django.post_report_comments(report_comment).subscribe(response => {
            this.comment_list.push(response['data']);
            (<HTMLTextAreaElement>document.getElementById("comment")).value = "";
            this.spinner.hide()
          }, err => {
            document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Please post the comment again</h5>";
            // $('#errorModalRequest').modal('show');
            $('#errorModalRequest').modal('show');
            // alert("Please post the comment again")
            this.spinner.hide()
          })
        }
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
        this.django.update_comment_flags({report_id : report_id}).subscribe(()=>{
          this.notification_list = []
          this.dataProvider.currentNotifications.subscribe((response:Array<any>) =>{
            console.log(response)
            this.notification_list = response.filter(element => {
              return (element.commentor != this.user_name) && (element.ddm_rmp_post_report != report_id)
            });
          })
          this.dataProvider.changeNotificationData(this.notification_list)
          this.comment_list.map(element =>{
            element["comment_read_flag"] = true
          })
          console.log(this.comment_list)
          this.spinner.hide()
        })
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
    this.django.get_report_description(query_report_id).subscribe(response => {
      this.summary = response
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  NewReportOnSelectedCriteria() {
    
    var checkbox_length = $(".report_id_checkboxes:checkbox:checked").length;
    if (checkbox_length < 1) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select atleast one report</h5>";
      $('#errorModalRequest').modal('show');
      // alert("Select atleast one report")
    }
    else if (checkbox_length > 1) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Can select only one report for generating new report with same criteria</h5>";
      $('#errorModalRequest').modal('show');
      // alert("Can select only one report for generating new report with same criteria")
    }
    else {
      var i = 0
        console.log("This is it");
        console.log(this.finalData[0].status);
        if (this.finalData[0].status == "Incomplete") {
          this.generated_id_service.changeUpdate(true)
          this.reportDataService.setReportID($(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
          this.router.navigate(["user/submit-request/select-report-criteria"]);
        }
        else {
          this.generated_id_service.changeUpdate(false)
          this.reportDataService.setReportID($(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
          this.router.navigate(["user/submit-request/select-report-criteria"]);
        }
      
    }
  }

  getRequestId(id){
    this.sharedDataService.setRequestId(id);
  }

  clearOnError(){
    $('.modal').modal('hide')
    $.each($("input[class='report_id_checkboxes']"), function () {
      $(this).prop("checked",false)
    });
    console.log("consoled")
  }
}



