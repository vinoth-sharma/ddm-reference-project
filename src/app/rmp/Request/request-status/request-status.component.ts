import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { NgxSpinnerService } from "ngx-spinner";
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, catchError, switchMap } from 'rxjs/operators';
import { RepotCriteriaDataService } from "../../services/report-criteria-data.service";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { Router } from "@angular/router";
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';
import * as Rx from "rxjs";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { AuthenticationService } from "src/app/authentication.service";
import { SharedDataService } from '../../../create-report/shared-data.service';
import { ToastrService } from "ngx-toastr";
import { SemanticReportsService } from '../../../semantic-reports/semantic-reports.service';
import { environment } from "../../../../environments/environment"
import { ScheduleService } from '../../../schedule/schedule.service'
import Utils from 'src/utils';


@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.css']
})
export class RequestStatusComponent implements OnInit, AfterViewInit {

  public searchText;
  public p;
  public frequency_flag;
  public changeDoc;
  public comment_text;
  public divDataSelected;
  public printDiv;
  public captureScreen;
  public param = "open_count";
  public orderType = 'desc';
  public fieldType = 'string';
  public isButton;
  public scheduleDataToBeSent:any = {};

  StatusSelectedItem = [];
  StatusDropdownSettings = {};
  StatusDropdownList = [];

  obj = {};
  hidVar = true;
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

  assignTBD = {
    "request_id": "",
    "requestor": ""
  }

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
  assignReportId: any;
  assignFullname: any
  contacts: Array<string>;
  dl_update = {
    "request_id": null,
    "dl_list": []
  };

  public Editor = ClassicEditor;
  contents;
  enable_edits = false
  editModes = false;
  original_contents;
  namings: string = "Loading";
  lookup;
  user_role: string;
  editorHelp: any;

  market_description: any;
  zone_description: any;
  area_description: any;
  region_description: any;
  lma_description: any;
  gmma_description: any;
  allocation_group: any;
  model_year: any;
  merchandising_model: any;
  vehicle_line_brand: any;
  order_event: any;
  order_type: any;
  checkbox_data: any;
  report_frequency: any;
  special_identifier: any;
  concensus_data: any;
  division_dropdown: any;

  tbd_report = [];
  tbdselectedItems_report = [];
  tbddropdownSettings_report = {};
  tbddropdownListfinal_report = []

  tbdselectedItemsAssigned = [];
  tbddropdownSettingsAssigned = {};
  tbddropdownListfinalAssigned = []
  usersList = []

  assignOwner = {
    'request_id': "",
    'users_table_id': "",
    'requestor': ""
  }

  assignOwner_Assigned = {
    'request_id': "",
    'assigned_to': ""
  }


  fullName = ""
  discList: any;
  ackList = {
    'data': []
  };

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  description_texts = {
    "ddm_rmp_desc_text_id": 13,
    "module_name": "Help_RequestStatus",
    "description": ""
  }
  user_name: string;
  notification_list: any[]; bac_description: any;
  notification_list_sort: any[];
  notification_number: any;
  fan_desc: any;
  text_notification: any;
  dl_flag: boolean;
  public model: string;
  notification_set: Set<any>;
  self_email: any;
  Status_List: { 'status_id': number; 'status': string; }[];
  setbuilder_sort: any[];
  statusFilter = [];
  filters = {
    global: '',
    status: ''
  }
  onGoingStatus = {
    "cancel_reports": []
  };
  

  notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }
  public editorConfig = {            //CKEDITOR CHANGE 
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Times New Roman, Times, serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    removePlugins: ['ImageUpload', 'Link', 'MediaEmbed'],
    fontSize: {
      options: [
        9, 11, 13, 'default', 17, 19, 21, 23, 24
      ]
    }
  };

  constructor(private generated_id_service: GeneratedReportService, private router: Router, private reportDataService: RepotCriteriaDataService,
    private django: DjangoService, private DatePipe: DatePipe, private spinner: NgxSpinnerService, private sharedDataService: SharedDataService, private semanticReportsService: SemanticReportsService
    , private dataProvider: DataProviderService, private auth_service: AuthenticationService, private toastr: ToastrService, private scheduleService:ScheduleService) {
    
      this.dataProvider.currentNotifications.subscribe((element:Array<any>) => {
        if (element) {
              this.notification_list_sort = element.filter(element => {
              return element.commentor != this.user_name
              })
              var setBuilder = []
              this.notification_list_sort.map(element => { 
                setBuilder.push(element.ddm_rmp_post_report)
              })  
              this.notification_set = new Set(setBuilder)
              this.setbuilder_sort = setBuilder
              this.notification_number = this.notification_set.size
        }
      })
    
    this.model = "";
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"]
        this.user_role = role["role"]
        this.self_email = role["email"]
      }
    })

    this.Status_List = [      
      { 'status_id': 1, 'status': 'Incomplete' },
      { 'status_id': 2, 'status': 'Pending' },
      { 'status_id': 3, 'status': 'Active' },
      { 'status_id': 4, 'status': 'Completed' },
      { 'status_id': 5, 'status': 'Recurring'},
      { 'status_id': 6, 'status': 'Cancelled' }
    ]
    this.contacts = []
    dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.lookup = element

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
        let refs = this.lookup['data']['desc_text']
        this.user_id = this.lookup['data']['user']
        let temps = refs.find(function (element) {
          return element["ddm_rmp_desc_text_id"] == 13;
        })
        if (temps) {
          this.original_contents = temps.description;
        }
        else { this.original_contents = "" }
        this.namings = this.original_contents;
        setTimeout(() => {
          this.generated_id_service.changeButtonStatus(false)
        })
        this.obj = { 'sort_by': '', 'page_no': 1, 'per_page': 200 }
        this.django.list_of_reports(this.obj).subscribe(list => {
          this.reports = list["report_list"];
          this.reports.forEach(element => {
            if(this.setbuilder_sort.includes(element.ddm_rmp_post_report_id)){
              element['unread'] = true;
            } else {
              element['unread'] = false;
            }
          });
          
          var reportsContainer = this.reports

          // reportsContainer.sort((a, b) => {
          //   return b['unread'] > a['unread'] ? 1 : -1
          // })
          reportsContainer.sort((a, b) => {
            if (b['unread'] == a['unread']) {
              return a['ddm_rmp_post_report_id'] > b['ddm_rmp_post_report_id'] ? 1 : -1
            }
            return b['unread'] > a['unread'] ? 1 : -1
          })

          this.reports = reportsContainer

          this.reports.forEach(reportRow => {
            reportRow['created_on'] = this.DatePipe.transform(reportRow['created_on'], 'dd-MMM-yyyy')
            reportRow['ddm_rmp_post_report_id'] = isNaN(+reportRow['ddm_rmp_post_report_id']) ? 99999 : +reportRow['ddm_rmp_post_report_id'];
          });
          this.count = list['report_list']
          this.item_per_page = list['report_list']
          this.page_num = list['report_list']
          this.reports.forEach(element => {
            element.isChecked = false;

          });
        }, err => {
        })
        this.report = this.report
      }
    })
  }

  ngOnInit() {



    this.django.getLookupValues().subscribe(check_user_data => {
      this.discList = check_user_data['data']['users_list']
      this.discList.forEach(ele => {
        this.fullName = ele.first_name + ' ' + ele.last_name
        this.usersList.push({ 'full_name': this.fullName, 'users_table_id': ele.users_table_id })
      })
      this.tbddropdownListfinal_report = this.usersList
      this.tbddropdownListfinalAssigned = this.usersList

      this.discList.forEach(element => {
        if (element['disclaimer_ack'] != null || element['disclaimer_ack'] != undefined) {
          this.ackList['data'].push(element)
        }
      })
    })

    this.tbddropdownSettings_report = {
      text: "Users",
      singleSelection: true,
      primaryKey: 'users_table_id',
      labelKey: 'full_name',
      enableSearchFilter: true
    };

    this.tbddropdownSettingsAssigned = {
      text: "Users",
      singleSelection: true,
      primaryKey: 'users_table_id',
      labelKey: 'full_name',
      enableSearchFilter: true
    };

    this.StatusDropdownSettings = {
      text: "Status",
      singleSelection: true,     
      primaryKey: 'status_id',
      labelKey: 'status',
    };
  }

  ngAfterViewInit() {
    ClassicEditor.create(document.querySelector('#ckEditorHelp'), this.editorConfig).then(editor => {
      this.editorHelp = editor;
      this.editorHelp.setData(this.namings);
      this.editorHelp.isReadOnly = true;
    })
      .catch(error => {
      });
  }

  content_edits() {
    this.spinner.show()
    this.editModes = false;
    this.editorHelp.isReadOnly = true
    this.description_texts['description'] = this.editorHelp.getData();
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {
      let temp_desc_text = this.lookup['data']['desc_text']
      temp_desc_text.map((element, index) => {
        if (element['ddm_rmp_desc_text_id'] == 13) {
          temp_desc_text[index] = this.description_texts
        }
      })
      this.lookup['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.lookup)
      this.editModes = false;
      this.ngOnInit()
      this.original_contents = this.namings;
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  edit_True() {
    if (this.editModes) {
      this.editorHelp.isReadOnly = true
    } else {
      this.editorHelp.isReadOnly = false
    }
    this.editModes = !this.editModes;
    this.namings = this.original_contents;
    this.editorHelp.setData(this.namings)
    $('#edit_button').show()
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
    this.reports.forEach(element => {
      if (element.ddm_rmp_post_report_id === event.ddm_rmp_post_report_id) {
        element.isChecked = eve.target.checked;
      }
    });
    console.log("request id verification : ",event.ddm_rmp_post_report_id);
    if (eve.target.checked) {
      this.cancel = event.ddm_rmp_post_report_id;

      this.finalData.push(event);

    }
    else {
      for (var i = 0; i < this.finalData.length; i++) {
        if (this.finalData[i].ddm_rmp_post_report_id == eve.target.id) {
          var index = this.finalData.indexOf(this.finalData[i]);
          this.finalData.splice(index, 1);
        }
      }
    }
    if (this.finalData.length == 1) {
      localStorage.setItem('report_id', this.finalData[0].ddm_rmp_post_report_id)
    }
    if (this.finalData.length == 1) {
      this.showODCBtn = this.finalData.every(ele => ele.status === 'Active' ? true : false)
    }
    else{
      this.showODCBtn = false;
    }

    // mimicODC
  }

  public showODCBtn: boolean = false;
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
  CheckCancel() {
    var i = 0;
    this.finalData.forEach(ele => {
      if (ele.status == "Cancelled") {
        i++;
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>" + "Request #" + ele.ddm_rmp_post_report_id + " is already cancelled" + "</h5>";
        $('#errorModalRequest').modal('show');
        this.finalData = [];
      }
    })
    if (i > 0) {
    } else {
      var checked_boxes = $(".report_id_checkboxes:checkbox:checked").length
      if (checked_boxes == 1) {
        this.finalData.forEach(ele => {
          if (ele.status == "Incomplete" || ele.status == "Pending") {
            $('#CancelRequest').modal('hide');
            $('#CancelPermanently').modal('show');
          }
          else if (ele.status == "Completed" || ele.status == "Active" || ele.status == "Recurring") {
            $('#CancelRequest').modal('show');
          }
        })
      }
      else if (checked_boxes == 0) {
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to Cancel</h5>";
        $('#errorModalRequest').modal('show');
      }
      else {
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Cannot cancel multiple reports</h5>";
        $('#errorModalRequest').modal('show');
      }
    }
  }

  Cancel() {
    this.spinner.show()
    this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
    this.finalData.map(element => {
      this.cancel_report.cancel_reports.push({ 'report_id': element['ddm_rmp_post_report_id'], 'status': "Cancelled", 'status_date': this.date })
    })

    this.django.cancel_report(this.cancel_report).subscribe(response => {
      this.obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(this.obj).subscribe(list => {
        this.reports = list["report_list"]
        this.spinner.hide()
        this.finalData = []
        $('#CancelRequest').modal('hide');
      })
    })
  }
  closeCancel() {
    this.finalData = []
  }
  closeCancel_modal(){
    this.finalData = []
    $('#CancelRequest').modal('hide');
  }

  AssignTBD() {
    this.spinner.show()
    this.finalData.map(element => {
      this.assignTBD['request_id'] = element['ddm_rmp_post_report_id']
      this.assignTBD['requestor'] = 'TBD'
    })
    this.django.ddm_rmp_tbd_req_put(this.assignTBD).subscribe(response => {
      this.obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(this.obj).subscribe(list => {
        this.reports = list["report_list"]
        this.spinner.hide()
        this.finalData = []
      })
      this.toastr.success("Updated Successfully")
      $('#CancelRequest').modal('hide');
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server Error")
    })
  }

  TBD(element) {
    this.assignReportId = element.ddm_rmp_post_report_id
  }

  TBDsave() {
    this.spinner.show();
    this.assignOwner['request_id'] = this.assignReportId
    this.assignOwner['users_table_id'] = this.tbdselectedItems_report[0]['users_table_id']
    this.assignOwner['requestor'] = this.tbdselectedItems_report[0]['full_name']

    this.django.assign_owner_post(this.assignOwner).subscribe(ele => {
      this.obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(this.obj).subscribe(list => {
        this.reports = list["report_list"]
        this.spinner.hide()
        this.finalData = []
      })
      this.toastr.success("Updated Successfully");
    }, err => {
      this.spinner.hide();
      this.toastr.error("Server Error");
    })
    this.tbdselectedItems_report = []
  }

  Assign_AssignTo(){
    this.spinner.show();
    this.finalData.map(element => {
      this.assignOwner_Assigned['request_id'] = element['ddm_rmp_post_report_id']
      this.assignOwner_Assigned['assigned_to'] = 'TBD'
    })
    this.django.ddm_rmp_assign_to(this.assignOwner_Assigned).subscribe(ele => {
      this.obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(this.obj).subscribe(list => {
        this.reports = list["report_list"]
        this.spinner.hide()
        this.finalData = []
      })
      this.toastr.success("Updated Successfully");
    }, err => {
      this.spinner.hide();
      this.toastr.error("Server Error");
    })
    this.tbdselectedItemsAssigned = []
  }

  TBD_Assigned() {
    this.spinner.show();
    this.assignOwner_Assigned['request_id'] = this.assignReportId
    this.assignOwner_Assigned['assigned_to'] = this.tbdselectedItemsAssigned[0]['full_name']

    this.django.ddm_rmp_assign_to(this.assignOwner_Assigned).subscribe(ele => {
      this.obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(this.obj).subscribe(list => {
        this.reports = list["report_list"]
        this.spinner.hide()
        this.finalData = []
      })
      this.toastr.success("Updated Successfully");
    }, err => {
      this.spinner.hide();
      this.toastr.error("Server Error");
    })
    this.tbdselectedItemsAssigned = []
  }

  closeTBD_Assigned() {
    this.tbdselectedItemsAssigned = [];
  }


  closeTBD() {
    this.tbdselectedItems_report = [];
  }


  sort_by() {
    this.spinner.show()
    if (this.sorted_by == "asc") {
      this.sorted_by = "desc";
    } else if (this.sorted_by == "desc") {
      this.sorted_by = "asc";
    }
    this.obj = { 'sort_by': this.sorted_by, 'page_no': 1, 'per_page': 6 }

    this.django.list_of_reports(this.obj).subscribe(list => {
      this.reports = list["report_list"]
      this.spinner.hide()
    })
    this.report = this.report
  }

  Accept() {
    var i = 0;
    this.finalData.forEach(ele => {
      if (ele.status == "Cancelled") {
        i++;
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>" + 'status for the report ' + ele.ddm_rmp_post_report_id + ' is already Cancelled and can not be accepted' + "</h5>";
        $('#errorModalRequest').modal('show');
        this.finalData = [];
      }
      else if (ele.status == "Incomplete") {
        i++;
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>" + 'status for the report ' + ele.ddm_rmp_post_report_id + ' is Incomplete and can not be accepted. Please complete the report' + "</h5>";
        $('#errorModalRequest').modal('show');
        this.finalData = [];
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
        this.django.accept_report(this.accept_report).subscribe(response => {
          this.finalData.forEach(element => {
            this.obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
            this.django.list_of_reports(this.obj).subscribe(list => {
              this.reports = list["report_list"]
              this.toastr.success("Status Changed to Active");
              this.spinner.hide()
              this.finalData = []
            })
          });
        }, err => {
          this.toastr.error("Server Error")
          this.spinner.hide()
        })
      }
      else if (checked_boxes == 0) {
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to Accept</h5>";
        $('#errorModalRequest').modal('show');
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
      const transformedData = this.reports.map(item => (headings.map(key => item[key] instanceof Array ? item[key].join(",") : item[key])))
      const colA = wb.cell("A2").value(transformedData);

      workbook.outputAsync().then(function (blob) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
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
      });
    }).catch(error => {
    });
  }


  post_link() {

    var i = 0;
    var checked_boxes = $(".report_id_checkboxes:checkbox:checked").length
    if (checked_boxes == 0) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to post link for it</h5>";
      $('#errorModalRequest').modal('show');
    }
    else if (checked_boxes > 1) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>You cannot post link on multiple reports at once</h5>";
      $('#errorModalRequest').modal('show');
      this.finalData = [];
    }


    else {
      this.finalData.forEach(ele => {
        if (checked_boxes == 1 && ele.status != "Active") {
          i++;
          document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Request not Active yet. Can't post link to results.</h5>";
          $('#errorModalRequest').modal('show');
          this.finalData = [];
        }
        else if (checked_boxes == 1 && ele.status == "Active" || ele.status == "Completed") {
          $("#post_link_button:button").trigger('click')
        }
      })
    }

  }

  closePostLink() {
    this.hidVar = true;
  }
  addDocument() {
    let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();

    if (document_title == "" || document_url == "") {
      this.hidVar = false;
    }
    else {
      this.hidVar = true;

      var checked_boxes = $(".report_id_checkboxes:checkbox:checked").length
      if (checked_boxes >= 1) {
        this.spinner.show()


        this.finalData.map(element => {
          this.edit_link = { 'report_id': element['ddm_rmp_post_report_id'], "link_title": document_title, "link_to_results": document_url }
        })

        this.spinner.show()
        this.django.post_link(this.edit_link).subscribe(response => {
          this.finalData.forEach(element => {
            this.obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
            this.django.list_of_reports(this.obj).subscribe(list => {
              this.reports = list["report_list"]
              this.spinner.hide()
              this.finalData = []
            })
            $("#postLink").modal('hide');
          });
        })
      }
      else if (checked_boxes == 0) {
        document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to post a link</h5>";
        $('#errorModalRequest').modal('show');
      }

    }
  }

  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

  checkbox_validation() {
    var checked_boxes = $(".report_id_checkboxes:checkbox:checked").length

    if (checked_boxes > 1) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>You cannot comment on multiple reports at once</h5>";
      $('#errorModalRequest').modal('show');
    }
    else if (checked_boxes == 0) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to comment on it</h5>";
      $('#errorModalRequest').modal('show');
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
    }
    else {

      this.spinner.show()
      let report_comment = {
        'ddm_rmp_post_report': 0,
        "comment": comment_text,
        "comment_read_flag": false,
        "audience": "",
        "commentor": this.user_name
      }

      $(".report_id_checkboxes:checkbox:checked").each(function (django: DjangoService, spinner: NgxSpinnerService) {
        var $this = $(this);
        if ($this.is(":checked")) {
          this.active_report_id_enter_comment = +($this.attr("id"))
          report_comment.ddm_rmp_post_report = this.active_report_id_enter_comment
        }
      });

      this.reports.forEach(element => {
        if (element.ddm_rmp_post_report_id == report_comment.ddm_rmp_post_report) {
          report_comment["audience"] = element.assigned_to

          this.django.post_report_comments(report_comment).subscribe(response => {
            this.comment_list.push(response['data']);
            (<HTMLTextAreaElement>document.getElementById("comment")).value = "";
            this.spinner.hide()
          }, err => {
            document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Please post the comment again</h5>";
            $('#errorModalRequest').modal('show');
            this.spinner.hide()
          })
        }
      })

    }
  }

  set_report_comments(report_id) {
    this.spinner.show()
    let accordion_id = "#accordion" + report_id;
    console.log($(accordion_id));
    if ($(accordion_id).hasClass('collapse')) {
      this.django.get_report_comments(report_id).subscribe(response => {
        this.comment_list = response['comments']
        this.django.update_comment_flags({ report_id: report_id }).subscribe(() => {
          this.notification_list = []
          this.dataProvider.currentNotifications.subscribe((response: Array<any>) => {
            this.notification_list = response.filter(element => {
              return (element.commentor != this.user_name) && (element.ddm_rmp_post_report != report_id)
            });
          })
          this.dataProvider.changeNotificationData(this.notification_list)
          this.comment_list.map(element => {
            element["comment_read_flag"] = true
          })
          this.spinner.hide()
        })
      }, err => {
        this.spinner.hide()
      })
    }
    else if ($(accordion_id).hasClass('in')) {
      this.spinner.hide()
    }
    // else
    //   this.spinner.hide()
    
  }

  query_criteria_click(query_report_id) {
    this.spinner.show()
    this.django.get_report_description(query_report_id).subscribe(response => {
      this.summary = response

      let tempArray = []
      if (this.summary["market_data"].length != 0) {
        if (this.summary["market_data"] == []) {
          this.market_description = []
        } else {
          this.summary["market_data"].map(element => {
            tempArray.push(element.market)
          })
        }
        this.market_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["country_region_data"].length != 0) {
        if (this.summary["country_region_data"] == []) {
          this.region_description = []
        } else {
          this.summary["country_region_data"].map(element => {
            tempArray.push(element.region_desc)
          })
        }
        this.region_description = tempArray.join(", ");
      }

      tempArray = []
      if (this.summary["region_zone_data"].length != 0) {
        if (this.summary["region_zone_data"] == []) {
          this.zone_description = []
        } else {
          this.summary["region_zone_data"].map(element => {
            tempArray.push(element.zone_desc)
          })
        }
        this.zone_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["zone_area_data"].length != 0) {
        if (this.summary["zone_area_data"] == []) {
          this.area_description = []
        } else {
          this.summary["zone_area_data"].map(element => {
            tempArray.push(element.area_desc)
          })
        }
        this.area_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["lma_data"].length != 0) {
        if (this.summary["lma_data"] == []) {
          this.lma_description = []
        } else {
          this.summary["lma_data"].map(element => {
            tempArray.push(element.lmg_desc)
          })
        }
        this.lma_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["gmma_data"].length != 0) {
        if (this.summary["gmma_data"] == []) {
          this.gmma_description = []
        } else {
          this.summary["gmma_data"].map(element => {
            tempArray.push(element.gmma_desc)
          })
        }
        this.gmma_description = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["frequency_data"].length != 0) {
        this.frequency_flag = true;
        if (this.summary["frequency_data"] == []) {
          this.report_frequency = []
        } else {
          this.summary["frequency_data"].map(element => {
            if (element.description != '') {
              tempArray.push(element.select_frequency_values + "-" + element.description)
            }
            else {
              tempArray.push(element.select_frequency_values)
            }
          })
        }
        this.report_frequency = tempArray.join(", ");
      }
      if (this.summary["frequency_data"].length == 0) {
        this.frequency_flag = false;
      }
      
      tempArray = []
      if (this.summary["division_dropdown"].length != 0) {
        if (this.summary["division_dropdown"] == []) {
          this.division_dropdown = []
        } else {
          this.summary["division_dropdown"].map(element => {
            tempArray.push(element.division_desc)
          })
        }
        this.division_dropdown = tempArray.join(", ");
      }
      tempArray = []
      if (this.summary["special_identifier_data"].length != 0) {
        if (this.summary["special_identifier_data"] == []) {
          this.special_identifier = []
        } else {
          this.summary["special_identifier_data"].map(element => {
            tempArray.push(element.spl_desc)
          })
        }
        this.special_identifier = tempArray.join(", ");
      }
      if (this.summary["ost_data"] != undefined) {

        tempArray = []
        if (this.summary["ost_data"]["allocation_group"].length != 0) {
          if (this.summary["ost_data"]["allocation_group"] == []) {
            this.allocation_group = []
          } else {
            this.summary["ost_data"]["allocation_group"].map(element => {
              tempArray.push(element.allocation_group)
            })
          }
          this.allocation_group = tempArray.join(", ");
        }
        tempArray = []
        if (this.summary["ost_data"]["model_year"].length != 0) {
          if (this.summary["ost_data"]["model_year"] == []) {
            this.model_year = []
          } else {
            this.summary["ost_data"]["model_year"].map(element => {
              tempArray.push(element.model_year)
            })
          }
          this.model_year = tempArray.join(", ");
        }
        tempArray = []
        if (this.summary["ost_data"]["vehicle_line"].length != 0) {
          if (this.summary["ost_data"]["vehicle_line"] == []) {
            this.vehicle_line_brand = []
          } else {
            this.summary["ost_data"]["vehicle_line"].map(element => {
              tempArray.push(element.vehicle_line_brand)
            })
          }
          this.vehicle_line_brand = tempArray.join(", ");
        }
        tempArray = []
        if (this.summary["ost_data"]["merchandizing_model"].length != 0) {
          if (this.summary["ost_data"]["merchandizing_model"] == []) {
            this.merchandising_model = []
          } else {
            this.summary["ost_data"]["merchandizing_model"].map(element => {
              tempArray.push(element.merchandising_model)
            })
          }
          this.merchandising_model = tempArray.join(", ");
        }
        tempArray = []
        if (this.summary["ost_data"]["order_event"].length != 0) {
          if (this.summary["ost_data"]["order_event"] == []) {
            this.order_event = []
          } else {
            this.summary["ost_data"]["order_event"].map(element => {
              tempArray.push(element.order_event)
            })
          }
          this.order_event = tempArray.join(", ");
        }
        tempArray = []
        if (this.summary["ost_data"]["order_type"].length != 0) {
          if (this.summary["ost_data"]["order_type"] == []) {
            this.order_type = []
          } else {
            this.summary["ost_data"]["order_type"].map(element => {
              tempArray.push(element.order_type)
            })
          }
          this.order_type = tempArray.join(", ");
        }
        tempArray = []
        if (this.summary["ost_data"]["checkbox_data"].length != 0) {
          if (this.summary["ost_data"]["checkbox_data"] == []) {
            this.checkbox_data = []
          } else {
            this.summary["ost_data"]["checkbox_data"].map(element => {
              if (element.description_text != '') {
                tempArray.push(element.checkbox_description + "-" + element.description_text)
              }
              else {
                tempArray.push(element.checkbox_description)
              }
            })
          }
          this.checkbox_data = tempArray.join(", ");
        }
      }

      //-----DA-----//
      if (this.summary["da_data"] != undefined) {
        tempArray = []
        if (this.summary["da_data"]["allocation_grp"].length != 0) {
          if (this.summary["da_data"]["allocation_grp"] == []) {
            this.allocation_group = []
          } else {
            this.summary["da_data"]["allocation_grp"].map(element => {
              tempArray.push(element.allocation_group)
            })
          }
          this.allocation_group = tempArray.join(", ");
        }
        tempArray = []
        if (this.summary["da_data"]["model_year"].length != 0) {
          if (this.summary["da_data"]["model_year"] == []) {
            this.model_year = []
          } else {
            this.summary["da_data"]["model_year"].map(element => {
              tempArray.push(element.model_year)
            })
          }
          this.model_year = tempArray.join(", ");
        }
        tempArray = []
        if (this.summary["da_data"]["concensus_data"].length != 0) {
          if (this.summary["da_data"]["concensus_data"] == []) {
            this.concensus_data = []
          } else {
            this.summary["da_data"]["concensus_data"].map(element => {
              tempArray.push(element.cd_values)
            })
          }
          this.concensus_data = tempArray.join(", ");
        }

      }

      if (this.summary["bac_data"].length != 0) {
        if (this.summary["bac_data"][0]["bac_desc"] == null) {
          this.bac_description = []
        } else {
          this.bac_description = (this.summary["bac_data"][0].bac_desc).join(", ");
        }
      }
      else {
        this.bac_description = []
      }

      if (this.summary["fan_data"].length != 0) {
        if (this.summary["fan_data"][0]["fan_data"] == null) {
          this.fan_desc = []
        } else {
          this.fan_desc = this.summary["fan_data"][0].fan_data.join(", ");
        }
      }
      else {
        this.fan_desc = []
      }
      this.text_notification = this.summary["user_data"][0]['alternate_number'];
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
    }
    else if (checkbox_length > 1) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Can select only one report for generating new report with same criteria</h5>";
      $('#errorModalRequest').modal('show');
    }
    else {
      this.reportDataService.setReportID($(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
      this.router.navigate(["user/submit-request/select-report-criteria"]);
      var i = 0
      console.log(this.finalData);
      // if (this.finalData[0].status == "Incomplete") {
      //   this.generated_id_service.changeUpdate(true)
      //   this.reportDataService.setReportID($(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
      //   this.router.navigate(["user/submit-request/select-report-criteria"]);
      // }
      // else if(this.finalData[0].status == "Active" || this.finalData[0].status == "Pending"){
      //   this.generated_id_service.changeUpdate(true)
      //   this.reportDataService.setReportID($(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
      //   this.router.navigate(["user/submit-request/select-report-criteria"]);
      // }
      // else {
      //   this.generated_id_service.changeUpdate(false)
      //   this.reportDataService.setReportID($(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
      //   this.router.navigate(["user/submit-request/select-report-criteria"]);
      // }

    }
  }

  getRequestId(element) {
    Utils.showSpinner();
    console.log("CREATE REPORT SELECTED ELEMENT!! : ",element);
    if (element.requestor != 'TBD') {
      // mimicODC here and then reroute if frequency is not ODC/OD?
      this.django.get_report_description(element.ddm_rmp_post_report_id).subscribe(response => {
        if(response){
        this.summary = response;
        // console.log("QUERY CRITERIA values",this.summary);
        // if(this.summary["frequency_data"].length == 0){
        // }
        // let isODC = this.summary["frequency_data"][0]["description"];
        let isODC = this.summary["frequency_data"][0]['select_frequency_values']
        //or
        // let isODC = this.summary["frequency_value"][0]['frequency']
  
        if (isODC === "On Demand Configurable" || isODC === "On Demand") {
          this.sharedDataService.setRequestId(element.ddm_rmp_post_report_id);
          this.toastr.error(" Please click on the CREATE ODC REPORT and continue !! ");
          Utils.hideSpinner();
          // this.router.navigate(['../../semantic/'])
          // this.router.navigate(['../../semantic/sem-reports/home'])
        }
        else {
          Utils.hideSpinner();
          this.sharedDataService.setRequestId(element.ddm_rmp_post_report_id);
          this.router.navigate(['../../semantic/sem-reports/home'])
          // this.toastr.error(" Please click on the CREATE ODC REPORT and continue !! ");
          return;
        }
      }
      })
      // this.router.navigate(['../../semantic/'])
    }
    else {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Assign an owner first to create the report</h5>";
      $('#errorModalRequest').modal('show');
    }
  }

  clearOnError() {
    $('.modal').modal('hide')
    $.each($("input[class='report_id_checkboxes']"), function () {
      $(this).prop("checked", false)
    });
    this.finalData = []
  }


  postLink(request_id) {
    this.spinner.show()
    this.django.get_report_id(request_id).subscribe(element => {
      if (element['report_id'].length == 0) {
        this.spinner.hide()
        alert("There is no summary for this report")
      }
      else {
        let report_list_id = element['report_id'][0]['report_list_id']
        this.django.get_report_file(request_id, report_list_id).subscribe(file_details => {
          var file_path_details = file_details["all_file_path"]["zip_url"]
          window.open(`${environment.baseUrl}` + file_path_details, '_blank')
          this.spinner.hide()
        })
      }
    })
  }

  public mimicODC(OdcRequestId) {
    let onDemandConfigurableRequestId = OdcRequestId.map(t => t.ddm_rmp_post_report_id);

    Utils.showSpinner();
    this.django.get_report_description(onDemandConfigurableRequestId).subscribe(response => {
      this.summary = response;
      // console.log("QUERY CRITERIA values",this.summary);
      // if(this.summary["frequency_data"].length == 0){

      // }
      // let isODC = this.summary["frequency_data"][0]["description"];
      let isODC = this.summary["frequency_data"][0]['select_frequency_values']
      //or
      // let isODC = this.summary["frequency_value"][0]['frequency']

      if (isODC === "On Demand Configurable") {
        this.sharedDataService.setRequestIds(onDemandConfigurableRequestId);
        Utils.hideSpinner();
        this.router.navigate(['../../semantic/sem-reports/home'])
      }
      else {
        Utils.hideSpinner();
        this.toastr.error("Your chosen request is not an ON DEMAND CONFIGURABLE request!");
        return;
      }
    })
  }

  getLink(index) {
    this.spinner.show();
    this.django.get_report_link(index).subscribe(ele => {
      var url = ele['data']['url']
      window.open(url, '_blank');
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error("Server Error");
    })

  }
  /*---------------------------Distribution List---------------------*/
  addContact() {
    let contact = this.model
    if (contact == "") {
      this.dl_flag = true
    }
    else {
      this.contacts.push(contact);
      this.dl_flag = false
      this.model = "";
    }
  }

  removeContact() {

    var sList = [];
    $('.form-check-input').each(function () {
      sList.push($(this).val() + (this.checked ? "checked" : "not checked"));
    });

    var indList = []
    for (var i = 0; i < sList.length; i++) {
      if (sList[i] == "checked") {
        indList.push(i);
      }
      else {
        indList = indList;
      }
    }


    for (var i = indList.length - 1; i >= 0; i--)
      this.contacts.splice(indList[i], 1);

  }

  populateDl() {
    this.contacts = []
    if (this.finalData.length == 1 && (this.finalData[0].status != "Cancelled" || this.finalData[0].status != "Completed")) {
      $('#DistributionListModal').modal('show');
      this.spinner.show();
      let reportID = this.finalData[0]['ddm_rmp_post_report_id']
      this.django.get_report_description(reportID).subscribe(element => {
        if (element["dl_list"].length != 0) {
          element["dl_list"].map(element => {
            this.contacts.push(element.distribution_list)
            this.dl_update.request_id = reportID;
            this.dl_update.dl_list = this.contacts
          })
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      })
    }
    else if (this.finalData.length == 0) {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Select a report to update DL</h5>";
      $('#errorModalRequest').modal('show');
    }
    else if (this.finalData[0].status == "Cancelled" || this.finalData[0].status == "Completed") {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Cannot update a cancelled/completed report</h5>";
      $('#errorModalRequest').modal('show');
    }
    else {
      document.getElementById("errorModalMessageRequest").innerHTML = "<h5>Cannot update multiple reports</h5>";
      $('#errorModalRequest').modal('show');
    }
  }
  updateDL() {
    this.spinner.show();
    this.django.report_distribution_list(this.dl_update).subscribe(response => {
      this.toastr.success("Distribution List updated", "Success:")
      $('#DistributionListModal').modal('hide');
      this.spinner.hide();

    }, err => {
      this.toastr.error("Server problem encountered", "Error:")
      this.spinner.hide();
    })

  }

  public searchGlobalObj = {
    'ddm_rmp_post_report_id': this.searchText,
    'ddm_rmp_status_date': this.searchText, 'created_on': this.searchText, 'title': this.searchText, 'requestor': this.searchText,
    'on_behalf_of': this.searchText, 'assigned_to': this.searchText, 'status': this.searchText
  }
  searchObj;

  // globalSearch(event) {
  //   this.searchText = event.target.value;
  //   this.searchGlobalObj["ddm_rmp_post_report_id"] = event.target.value;
  //   this.searchGlobalObj["ddm_rmp_status_date"] = event.target.value;
  //   this.searchGlobalObj["created_on"] = event.target.value;
  //   this.searchGlobalObj["title"] = event.target.value;
  //   this.searchGlobalObj["requestor"] = event.target.value;
  //   this.searchGlobalObj["on_behalf_of"] = event.target.value;
  //   this.searchGlobalObj["assigned_to"] = event.target.value;
  //   this.searchGlobalObj['status'] = event.target.value;
  //   this.searchObj = this.searchGlobalObj;
  //   setTimeout(() => {
  //     this.reports = this.reports.slice();
  //   }, 0);
  // }

  // onItemSelectStatus(event, status) {
  //   this.searchGlobalObj['status'] = event.status
  //   this.searchGlobalObj["ddm_rmp_post_report_id"] = event.status;
  //   this.searchGlobalObj["ddm_rmp_status_date"] = event.status;
  //   this.searchGlobalObj["created_on"] = event.status;
  //   this.searchGlobalObj["title"] = event.status;
  //   this.searchGlobalObj["requestor"] = event.status;
  //   this.searchGlobalObj["on_behalf_of"] = event.status;
  //   this.searchGlobalObj["assigned_to"] = event.status;

  //   this.searchObj = this.searchGlobalObj;
  //   setTimeout(() => {
  //     this.reports = this.reports.slice();
  //   }, 0);
  // }

  // onItemDeSelectStatus(event, status) {
  //   this.searchGlobalObj['status'] = "";
  //   this.searchGlobalObj["ddm_rmp_post_report_id"] = "";
  //   this.searchGlobalObj["ddm_rmp_status_date"] = "";
  //   this.searchGlobalObj["created_on"] = "";
  //   this.searchGlobalObj["title"] = "";
  //   this.searchGlobalObj["requestor"] = "";
  //   this.searchGlobalObj["on_behalf_of"] = "";
  //   this.searchGlobalObj["assigned_to"] = "";

  //   this.searchObj = this.searchGlobalObj;
  //   setTimeout(() => {
  //     this.reports = this.reports.slice();
  //   }, 0);
  // }

  filterData() {
    console.log("Data", this.statusFilter);
    if (this.statusFilter.length) {
      this.filters.status = this.statusFilter[0] ? this.statusFilter[0].status : '';
      console.log("Data", this.filters);
    } else {
      this.filters.status = '';
    }
    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }

 
  searchUserList = (text$: Observable<string>) => {

    let vs = text$.pipe(
      debounceTime(10),
      distinctUntilChanged(),
      switchMap(term => {

        return this.django.getDistributionList(term);
      })
    )

    return vs
  }

  public openScheduler(requestId : number){
    // console.log("Request ID captured : ",requestId);
    // console.log("STARTING THE FETCHING OF DETAILS USING REQUEST-ID!!!!")
    this.scheduleService.getScheduleReportData(requestId,1).subscribe(res=>{
      Utils.showSpinner();
      if(res){
      // console.log("results fetched",res);
      this.scheduleService.scheduleReportIdFlag = res['data']['report_schedule_id'] || null; // to separate the post() and put()
      this.scheduleDataToBeSent = res['data'];
      Utils.hideSpinner(); 
      $('#ongoingScheduleModal').modal('show');
      }
      }, 
      error => {
      Utils.hideSpinner();
      this.toastr.error('Scheduled report loading failed');
    });
  }

  public changeOngoingStatus(event){
    this.spinner.show();
    console.log("confirmOngoing called here!!!");
    console.log("recieved ongoing object",event);

    this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
    this.finalData.map(element => {
    })
      this.onGoingStatus.cancel_reports.push({ 'report_id': event.requestId, 'status': "Completed", 'status_date': this.date })
    this.django.cancel_report(this.onGoingStatus).subscribe(response => {
      this.obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(this.obj).subscribe(list => {
        this.reports = list["report_list"]
        this.spinner.hide()
        this.finalData = []
      },err=>{
        this.spinner.hide();
      })
    },err=>{
      this.spinner.hide();
    })
    //extract values andthen update ongoing status and then call refresh api
    // this.cancel_report
  }
}