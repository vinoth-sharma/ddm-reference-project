import { Component, OnInit, OnChanges } from '@angular/core';
declare var $: any;
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, catchError, switchMap } from 'rxjs/operators';
// import { ReportCriteriaDataService } from ".../services/report-criteria-data.service";
import { ReportCriteriaDataService } from "../services/report-criteria-data.service";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { Router } from "@angular/router";
import * as Rx from "rxjs";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { AuthenticationService } from "src/app/authentication.service";
import { SharedDataService } from '../../create-report/shared-data.service';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { SemanticReportsService } from '../../semantic-reports/semantic-reports.service';
import { environment } from "./../../../environments/environment"
import { ScheduleService } from '../../schedule/schedule.service';
import Utils from 'src/utils';


@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.css']
})
export class RequestStatusComponent implements OnInit, OnChanges{

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
  public enableUpdateData = false;
  public textChange = false;
  public StatusSelectedItem = [];
  public StatusDropdownSettings = {};
  public StatusDropdownList = [];
  public hidVar = true;
  public dropdownList = [];
  public selectedItems = [];
  public dropdownSettings = {};
  public report: any;
  public column: string[];
  public reports: any = null;
  public report_ids: any;
  public created_on: any;
  public title: any;
  public assigned: any;
  public status_date: any;
  public status: any;
  public user: any;
  public links: any;
  public behalf: any;
  public query: any;
  public cancel = {};
  public date: String;
  public finalData = []
  public sorted_by: any;
  public comment_list: Array<object> = []
  public summary: any;
  public assignTBD = {
    "request_id": "",
    "requestor": ""
  };
  public document_detailsEdit = {};
  public cancel_report = {
    "cancel_reports": []
  };
  public accept_report = {
    "accept_reports": []
  };
  public add_link: { 'report_id': number; "link_title": string; "link_to_results": string; };
  public edit_link: { 'report_id': number; "link_title": string; "link_to_results": string; };
  public active_report_id_enter_comment: number;
  public collection = [];
  public status_reports: any;
  public id_get: any;
  public user_id: any;
  public assignReportId: any;
  public assignFullname: any
  public contacts: Array<string>;
  public dl_update = {
    "request_id": null,
    "dl_list": []
  };
  public contents;
  public enable_edits = false
  public editModes = false;
  public original_contents;
  public namings: string = "Loading";
  public lookup;
  public user_role: string;
  public market_description: any;
  public zone_description: any;
  public area_description: any;
  public region_description: any;
  public lma_description: any;
  public gmma_description: any;
  public allocation_group: any;
  public model_year: any;
  public merchandising_model: any;
  public vehicle_line_brand: any;
  public order_event: any;
  public order_type: any;
  public checkbox_data: any;
  public report_frequency: any;
  public special_identifier: any;
  public concensus_data: any;
  public division_dropdown: any;
  public tbd_report = [];
  public tbdselectedItems_report = [];
  public tbddropdownSettings_report = {};
  public tbddropdownListfinal_report = [];
  public tbdselectedItemsAssigned = [];
  public tbddropdownSettingsAssigned = {};
  public tbddropdownListfinalAssigned = [];
  public usersList = [];
  public showODCBtn: boolean = false;
  public assignOwner = {
    'request_id': "",
    'users_table_id': "",
    'requestor': ""
  };
  public assignOwner_Assigned = {
    'request_id': "",
    'assigned_to': ""
  };
  public fullName = "";
  public discList: any;
  public ackList = {
    'data': []
  };
  public parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public description_texts = {
    "ddm_rmp_desc_text_id": 13,
    "module_name": "Help_RequestStatus",
    "description": ""
  };
  public user_name: string;
  public notification_list: any[]; 
  public bac_description: any;
  public notification_list_sort: any[];
  public notification_number: any;
  public fan_desc: any;
  public text_notification: any;
  public dl_flag: boolean;
  public model: string;
  public notification_set: Set<any>;
  public self_email: any;
  public Status_List: { 'status_id': number; 'status': string; }[];
  public setbuilder_sort: any[];
  public statusFilter = [];
  public filters = {
    global: '',
    status: ''
  };
  public onGoingStatus = {
    "cancel_reports": []
  };
  public searchObj;
  public config = {
    toolbar: [
      ['bold','italic','underline','strike'],
      ['blockquote'],
      [{'list' : 'ordered'}, {'list' : 'bullet'}],
      [{'script' : 'sub'},{'script' : 'super'}],
      [{'size':['small',false, 'large','huge']}],
      [{'header':[1,2,3,4,5,6,false]}],
      [{'color': []},{'background':[]}],
      [{'font': []}],
      [{'align': []}],
      ['clean'],
      ['image']
    ]
  };
  public errorModalMessageRequest = '';
  public documentName: any;
  public documentUrl: any;
  public readOnlyContentHelper = true;
  public cancel_response: any;
  public link_response: any;
  public postLink_result: any;
  public file_path: any;
  public ongoingStatusResult: any;
  public checkbox_length: number;

  // notify() {
  //   this.enable_edits = !this.enable_edits
  //   this.parentsSubject.next(this.enable_edits)
  //   this.editModes = true
  //   $('#edit_button').hide()
  // }

  constructor(private generated_id_service: GeneratedReportService, 
              private router: Router, 
              private reportDataService: ReportCriteriaDataService,
              private django: DjangoService, private DatePipe: DatePipe,
              private sharedDataService: SharedDataService, 
              private semanticReportsService: SemanticReportsService,
              private dataProvider: DataProviderService, 
              private auth_service: AuthenticationService, 
              private toastr: NgToasterComponent, 
              private scheduleService:ScheduleService) {
          this.getCurrentNotifications(); 
          this.model = "";
          this.getRoleDetails();
          this.Status_List = [      
            { 'status_id': 1, 'status': 'Incomplete' },
            { 'status_id': 2, 'status': 'Pending' },
            { 'status_id': 3, 'status': 'Active' },
            { 'status_id': 4, 'status': 'Completed' },
            { 'status_id': 5, 'status': 'Recurring'},
            { 'status_id': 6, 'status': 'Cancelled' }
          ];
          this.contacts = [];
          this.currentLookUpTableData();

  }

  public getCurrentNotifications() {
    this.dataProvider.currentNotifications.subscribe((element:Array<any>) => {
      if (element) {
            this.notification_list_sort = 
            element.filter(element => element.commentor != this.user_name);
            var setBuilder = [];
            this.notification_list_sort.
                map(element => setBuilder.push(element.ddm_rmp_post_report));  
            this.notification_set = new Set(setBuilder);
            this.setbuilder_sort = setBuilder;
            this.notification_number = this.notification_set.size;
      }
    });
  }

  public getRoleDetails() {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"];
        this.user_role = role["role"];
        this.self_email = role["email"];
      }
    });
  }

  public currentLookUpTableData() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.lookup = element;
        for (let i = 1; i <= 100; i++) {
          this.collection.push(`item ${i}`);
        }
        this.sorted_by = "asc";
        $(document).ready(function () {
          $('.ok-btn').prop('disabled', true);
          $('.text-to-display-input').keyup(function () {
            if ($(this).val() != '') 
              $('.ok-btn').prop("disabled", false);
            else 
              $('.ok-btn').prop('disabled', true);
          });
        });

        $(document).ready(function () {
          $('.address-open-button').prop('disabled', true);
          $('.address-text').keyup(function () {
            if ($(this).val() != '')
              $('.address-open-button').prop("disabled", false);
            else 
              $('.address-open-button').prop('disabled', true);
          });
        });
        let refs = this.lookup['data']['desc_text'];
        this.user_id = this.lookup['data']['user'];
        let temps = refs.find(element => element["ddm_rmp_desc_text_id"] == 13);
        if (temps)  this.original_contents = temps.description;
        else this.original_contents = ""; 
        this.namings = this.original_contents;
        this.generated_id_service.changeButtonStatus(false);
        const obj = { 'sort_by': '', 'page_no': 1, 'per_page': 200 }
        this.django.list_of_reports(obj).subscribe(list => {
          list["report_list"].forEach(element => {
            if(this.setbuilder_sort.includes(element.ddm_rmp_post_report_id))
              element['unread'] = true; 
            else  element['unread'] = false;

            element['created_on'] = this.DatePipe.transform(element['created_on'], 'dd-MMM-yyyy')
            element['ddm_rmp_post_report_id'] = isNaN(+element['ddm_rmp_post_report_id']) ? 99999 : +element['ddm_rmp_post_report_id'];

            if(element && element.isChecked) element.isChecked = false;
          });
          list["report_list"] = list["report_list"].sort((a, b) => {
            if (b['unread'] == a['unread']) {
              return a['ddm_rmp_post_report_id'] > b['ddm_rmp_post_report_id'] ? 1 : -1;
            }
            return b['unread'] > a['unread'] ? 1 : -1;
          });
          this.reports = list["report_list"];
        });
      }
    });
  }

  public ngOnInit() {
    this.django.getLookupValues().subscribe(check_user_data => {
      check_user_data['data']['users_list'].forEach(ele => {
        this.fullName = ele.first_name + ' ' + ele.last_name;
        this.usersList.push({ 'full_name': this.fullName, 'users_table_id': ele.users_table_id });

        if (ele['disclaimer_ack'] != null || ele['disclaimer_ack'] != undefined) 
          this.ackList['data'].push(ele);
      });
      this.tbddropdownListfinal_report = this.tbddropdownListfinalAssigned = this.usersList;
      this.discList = check_user_data['data']['users_list'];
    });

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

  public ngOnChanges() {
    let s = $(".report_id_checkboxes:checkbox:checked").length;
    console.log(s, 'cheking----s');
  }

  public textChanged(event) {
    this.textChange = true;
    if(!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  public content_edits() {
    if(!this.textChange || this.enableUpdateData) {
      Utils.showSpinner();
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_texts['description'] = this.namings;
      $('#edit_button').show();
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).
      subscribe(response => {
        this.lookup['data']['desc_text'].map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 13)
            this.lookup['data']['desc_text'][index] = this.description_texts;
        });
        this.dataProvider.changelookUpTableData(this.lookup);
        this.ngOnInit();
        this.original_contents = this.namings;
        this.toastr.success("Updated Successfully");
        Utils.hideSpinner();
      }, err => {
        Utils.hideSpinner();
        this.toastr.error("Data not Updated")
      })
    } else  {
      this.toastr.error("please enter the data");
      }
  }

  public edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_contents;
  }

  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_contents;
  }

  public sort(typeVal) {
    this.param = typeVal.toLowerCase().replace(/\s/g, "_");
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
    if (['ddm_rmp_post_report_id'].includes(this.param)) {
      this.fieldType = 'number';
    } else {
      this.fieldType = 'string';
    }
  }

  public Report_request(element, event) {
    this.cancel = element.ddm_rmp_post_report_id;
    this.showODCBtn = element['status'] === 'Active'? true : false;
    this.reports.forEach(ele => {
      if (ele.ddm_rmp_post_report_id === element.ddm_rmp_post_report_id) {
        this.finalData = [ele];
        ele.isChecked = event.target.checked;
        if(event.target.checked) 
          localStorage.setItem('report_id', element.ddm_rmp_post_report_id);
      } else ele.isChecked = false;
    });
    // mimicODC
  }
  
  public open(event, element) {
    this.id_get = element.ddm_rmp_post_report_id;
    this.user_id = element.user_id;
    this.reportDataService.setReportID(this.id_get);
    this.reportDataService.setUserId(this.user_id);
    this.generated_id_service.changeUpdate(true)
  }

  public DealerAllocation(event) {
  }

  public OrderToSale(event) {

  }
  public CheckCancel() {
    this.finalData = [];
    this.reports.find(e => {
       if(e.isChecked) {
          if(e.status == "Cancelled") {
            this.errorModalMessageRequest = "Request #" + e.ddm_rmp_post_report_id + " is already cancelled" ;
            $('#errorModalRequest').modal('show');
            this.finalData = [];
          } else {
            this.finalData = [e];
            if ($(".report_id_checkboxes:checkbox:checked").length) {
              if (e.status == "Incomplete" || e.status == "Pending") {
                $('#CancelRequest').modal('hide');
                $('#CancelPermanently').modal('show');
              }
              else if (e.status == "Completed" || e.status == "Active" ||
                       e.status == "Recurring") {
                $('#CancelPermanently').modal('hide');
                $('#CancelRequest').modal('show');
              }
            }
            else if (!$(".report_id_checkboxes:checkbox:checked").length) {
              this.errorModalMessageRequest = "Select a report to Cancel";
              $('#errorModalRequest').modal('show');
            }
            else {
              this.errorModalMessageRequest = "Cannot cancel multiple reports";
              $('#errorModalRequest').modal('show');
            }
          }
       } 
      });
  }

  
  public Cancel() {
    Utils.showSpinner();
    this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
      this.cancel_report.cancel_reports.push({ 
              'report_id': this.finalData[0]['ddm_rmp_post_report_id'],
              'status': "Cancelled", 
              'status_date': this.date 
            });

    this.django.cancel_report(this.cancel_report).subscribe(response => {
      this.cancel_response = response;
      const obj  = { 'sort_by': '', 'page_no': 1, 'per_page': 6 };
      this.django.list_of_reports(obj).subscribe(list => {
        this.reports = list["report_list"];
        Utils.hideSpinner();
        this.finalData = [];
        $('#CancelRequest').modal('hide');
      })
    })
  }
  public closeCancel() {
    this.finalData = [];
  }
  public closeCancel_modal(){
    this.finalData = [];
    $('#CancelRequest').modal('hide');
  }

  public assign_res;
  public AssignTBD() {
    Utils.showSpinner();
      this.assignTBD['request_id'] = this.finalData[0]['ddm_rmp_post_report_id'];
      this.assignTBD['requestor'] = 'TBD';
    this.django.ddm_rmp_tbd_req_put(this.assignTBD).subscribe(response => {
      this.assign_res = response;
      const obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 };
      this.django.list_of_reports(obj).subscribe(list => {
        this.reports = list["report_list"];
        Utils.hideSpinner();
        this.finalData = [];
        this.toastr.success("Updated Successfully")
        $('#CancelRequest').modal('hide');
      });
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Server Error")
    })
  }

  public TBD(element) {
    this.assignReportId = element.ddm_rmp_post_report_id;
  }

  public Tbd_res;
  public TBDsave() {
    Utils.showSpinner();
    this.assignOwner['request_id'] = this.assignReportId;
    this.assignOwner['users_table_id'] = this.tbdselectedItems_report[0]['users_table_id'];
    this.assignOwner['requestor'] = this.tbdselectedItems_report[0]['full_name'];

    this.django.assign_owner_post(this.assignOwner).subscribe(ele => {
      this.Tbd_res = ele;
      const obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(obj).subscribe(list => {
        this.reports = list["report_list"]
        Utils.hideSpinner();
        this.finalData = []
      })
      this.toastr.success("Updated Successfully");
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Server Error");
    })
    this.tbdselectedItems_report = []
  }

  public assigned_res;
  public Assign_AssignTo(){
    Utils.showSpinner();
      this.assignOwner_Assigned['request_id'] = this.finalData[0]['ddm_rmp_post_report_id'];
      this.assignOwner_Assigned['assigned_to'] = 'TBD';
    this.django.ddm_rmp_assign_to(this.assignOwner_Assigned).subscribe(ele => {
      this.assigned_res = ele;
      const obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(obj).subscribe(list => {
        this.reports = list["report_list"];
        Utils.hideSpinner();
        this.finalData = [];
      })
      this.toastr.success("Updated Successfully");
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Server Error");
    })
    this.tbdselectedItemsAssigned = [];
  }

  public tbd_assign_res;
  public TBD_Assigned() {
    Utils.showSpinner();
    this.assignOwner_Assigned['request_id'] = this.assignReportId;
    this.assignOwner_Assigned['assigned_to'] = this.tbdselectedItemsAssigned[0]['full_name'];
    this.django.ddm_rmp_assign_to(this.assignOwner_Assigned).subscribe(ele => {
      this.tbd_assign_res = ele;
      const obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(obj).subscribe(list => {
        this.reports = list["report_list"];
        Utils.hideSpinner();
        this.finalData = [];
      })
      this.toastr.success("Updated Successfully");
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Server Error");
    })
    this.tbdselectedItemsAssigned = [];
  }

  public closeTBD_Assigned() {
    this.tbdselectedItemsAssigned = [];
  }

  public closeTBD() {
    this.tbdselectedItems_report = [];
  }

  public sort_by() {
    Utils.showSpinner();
    if (this.sorted_by == "asc") 
      this.sorted_by = "desc"; 
    else if (this.sorted_by == "desc") 
      this.sorted_by = "asc";

    const obj = { 'sort_by': this.sorted_by, 'page_no': 1, 'per_page': 6 };

    this.django.list_of_reports(obj).subscribe(list => {
      this.reports = list["report_list"];
      Utils.hideSpinner();
    });
  }

  public Accept() {

    if (this.finalData[0].status == "Cancelled") {
      this.errorModalMessageRequest = 'status for the report ' + this.finalData[0].ddm_rmp_post_report_id + ' is already Cancelled and can not be accepted';
      $('#errorModalRequest').modal('show');
      this.finalData = [];
    }
    else if (this.finalData[0].status == "Incomplete") {
      this.errorModalMessageRequest = 'status for the report ' + this.finalData[0].ddm_rmp_post_report_id + ' is Incomplete and can not be accepted. Please complete the report' ;
      $('#errorModalRequest').modal('show');
      this.finalData = [];
    } else {
      if ($(".report_id_checkboxes:checkbox:checked").length) {
        Utils.showSpinner();
        this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS');
        this.accept_report.accept_reports.push(
            { 
              'report_id': this.finalData[0]['ddm_rmp_post_report_id'], 
              'assign_to': this.user_name, 'status_date': this.date,
              'status': 'Active' 
            });
       
        this.django.accept_report(this.accept_report).subscribe(response => {
            const obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
            this.django.list_of_reports(obj).subscribe(list => {
              this.reports = list["report_list"];
              this.reports.forEach(ele => {
                if (ele.ddm_rmp_post_report_id === 
                  this.finalData[0].ddm_rmp_post_report_id) 
                  this.showODCBtn = ele['status'] === 'Active'? true : false;
              });
              this.toastr.success("Status Changed to Active");
              Utils.hideSpinner();
              this.finalData = [];
          });
        }, err => {
          this.toastr.error("Server Error")
          Utils.hideSpinner();
        })
      }
      else if (!$(".report_id_checkboxes:checkbox:checked").length) {
        this.errorModalMessageRequest = "Select a report to Accept";
        $('#errorModalRequest').modal('show');
      }
    }
  }

  public xlsxJson() {
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

  public post_link() {
    this.checkbox_length = $(".report_id_checkboxes:checkbox:checked").length;
    if (this.checkbox_length == 0) {
      this.errorModalMessageRequest = "Select a report to post link for it";
      $('#errorModalRequest').modal('show');
    }
    else if (this.checkbox_length > 1) {
      this.errorModalMessageRequest = "You cannot post link on multiple reports at once";
      $('#errorModalRequest').modal('show');
      this.finalData = [];
    } else if(this.checkbox_length == 1) {
       if(this.finalData[0].status != "Active") {
        this.errorModalMessageRequest = "Request not Active yet. Can't post link to results.";
        $('#errorModalRequest').modal('show');
        this.finalData = [];
       } else if(this.finalData[0].status == "Active" ||                             
                 this.finalData[0].status == "Completed") {}
        $("#post_link_button:button").trigger('click');
    }
  }
  public closePostLink() {
    this.hidVar = true;
  }

  public add_response;
  public addDocument() {
    if (this.documentName == "" || this.documentUrl == "") {
          this.hidVar = false;
    } else {
      this.hidVar = true;
      this.checkbox_length = $(".report_id_checkboxes:checkbox:checked").length;
      if (this.checkbox_length >= 1) {
        Utils.showSpinner();
        this.edit_link = { 
            'report_id': this.finalData[0]['ddm_rmp_post_report_id'],
            "link_title": this.documentName, 
            "link_to_results": this.documentUrl 
          };
        this.django.post_link(this.edit_link).subscribe(response => {
          this.add_response = response;
            const obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 };
            this.django.list_of_reports(obj).subscribe(list => {
              this.reports = list["report_list"];
              Utils.hideSpinner();
              this.finalData = [];
            })
            $("#postLink").modal('hide');
        });
      }
      else if (this.checkbox_length == 0) {
        this.errorModalMessageRequest = "Select a report to post a link";
        $('#errorModalRequest').modal('show');
      }
    }
  }

  public onItemSelect(item: any) {
  }
  public onSelectAll(items: any) {
  }

  public checkbox_validation() {
    this.checkbox_length = $(".report_id_checkboxes:checkbox:checked").length;

    if (this.checkbox_length > 1) {
      this.errorModalMessageRequest = "You cannot comment on multiple reports at once";
      $('#errorModalRequest').modal('show');
    }
    else if (this.checkbox_length == 0) {
      this.errorModalMessageRequest = "Select a report to comment on it";
      $('#errorModalRequest').modal('show');
    }
    else if (this.checkbox_length == 1) {
     this.comment_text = "";
      $("#enter_comment_button:button").trigger('click');
      $(".report_id_checkboxes:checkbox:checked").each(function () {
        var $this = $(this);
        if ($this.is(":checked")) {
          this.active_report_id_enter_comment = +($this.attr("id"))
        }
      });
    }
  }

  public extract_comment() {
    if (this.comment_text == "") {
      this.errorModalMessageRequest = "Enter some comment";
      $('#errorModalRequest').modal('show');
    }
    else {
      Utils.showSpinner();
      let report_comment = {
        'ddm_rmp_post_report': 0,
        "comment": this.comment_text,
        "comment_read_flag": false,
        "audience": "",
        "commentor": this.user_name
      };

      $(".report_id_checkboxes:checkbox:checked").each(function (django: DjangoService, spinner: NgToasterComponent) {
        var $this = $(this);
        if ($this.is(":checked")) {
          this.active_report_id_enter_comment = +($this.attr("id"));
          report_comment.ddm_rmp_post_report = this.active_report_id_enter_comment;
        }
      });

      this.reports.forEach(element => {
        if (element.ddm_rmp_post_report_id == report_comment.ddm_rmp_post_report) {
          report_comment["audience"] = element.assigned_to

          this.django.post_report_comments(report_comment).subscribe(response => {
            this.comment_list.push(response['data']);
            this.comment_text = "";
            Utils.hideSpinner();
          }, err => {
            this.errorModalMessageRequest = "Please post the comment again";
            $('#errorModalRequest').modal('show');
            Utils.hideSpinner();
          })
        }
      });

    }
  }

  public set_report_comments(report_id) {
    Utils.showSpinner();
    let accordion_id = "#accordion" + report_id;
    if ($(accordion_id).hasClass('collapse')) {
      this.django.get_report_comments(report_id).subscribe(response => {
        this.comment_list = response['comments'];
        this.django.update_comment_flags({ report_id: report_id }).subscribe(() => {
          this.notification_list = [];
          this.dataProvider.currentNotifications.subscribe((response: Array<any>) => {
            this.notification_list = response.filter(element => {
              return (element.commentor != this.user_name) && (element.ddm_rmp_post_report != report_id)
            });
          })
          this.dataProvider.changeNotificationData(this.notification_list);
          this.comment_list.map(element => {
            element["comment_read_flag"] = true
          });
          Utils.hideSpinner();
        })
      }, err => {
        Utils.hideSpinner();
      })
    }
    else if ($(accordion_id).hasClass('in')) {
      Utils.hideSpinner();
    }
  }

  public query_criteria_click(query_report_id) {
    Utils.showSpinner();
    this.django.get_report_description(query_report_id).subscribe(response => {
      this.summary = response;
      if (this.summary["market_data"].length) {
        let tempArray = [];
        this.summary["market_data"].map(element => tempArray.push(element.market));
        this.market_description = tempArray.join(", ");
      } else {
        this.market_description = [];
      }
      if (this.summary["country_region_data"].length) {
        let tempArray = [];
          this.summary["country_region_data"].
              map(element => tempArray.push(element.region_desc));
        this.region_description = tempArray.join(", ");
      } else {
        this.region_description = [];
      }

      if (this.summary["region_zone_data"].length) {
        let tempArray = [];
        this.summary["region_zone_data"].map(element =>
          tempArray.push(element.zone_desc))
        this.zone_description = tempArray.join(", ");
      } else {
        this.zone_description = [];
      }

      if (this.summary["zone_area_data"].length) {
        let tempArray = [];
        this.summary["zone_area_data"].map(element => 
          tempArray.push(element.area_desc))
        this.area_description = tempArray.join(", ");
      } else {
        this.area_description = [];
      }

      if (this.summary["lma_data"].length) {
        let tempArray = [];
          this.summary["lma_data"].map(element => 
            tempArray.push(element.lmg_desc) );
        this.lma_description = tempArray.join(", ");
      } else {
        this.lma_description = [];
      }

      if (this.summary["gmma_data"].length) {
        let tempArray = [];
          this.summary["gmma_data"].map(element => 
            tempArray.push(element.gmma_desc));
        this.gmma_description = tempArray.join(", ");
      } else {
        this.gmma_description = [];
      }

      if (this.summary["frequency_data"].length) {
        let tempArray = [];
        this.frequency_flag = true;
          this.summary["frequency_data"].map(element => {
            if (element.description != '') 
              tempArray.push(element.select_frequency_values + "-" + element.description);
            else 
              tempArray.push(element.select_frequency_values);
          });
        this.report_frequency = tempArray.join(", ");
      } else {
        this.report_frequency = [];
        this.frequency_flag = false;
      }

      if (!this.summary["division_dropdown"].length) 
        this.division_dropdown = []
      else {
        let tempArray = [];
        this.summary["division_dropdown"].map(element => 
          tempArray.push(element.division_desc));
        this.division_dropdown = tempArray.join(", ");
      }
      
      if (this.summary["special_identifier_data"].length) {
        let tempArray = [];
        this.summary["special_identifier_data"].map(element => 
          tempArray.push(element.spl_desc));
        this.special_identifier = tempArray.join(", ");
      } else {
        this.special_identifier = [];
      }

      if (this.summary["ost_data"]) {
        if (this.summary["ost_data"]["allocation_group"].length) {
          let tempArray = [];
            this.summary["ost_data"]["allocation_group"].map(element => {
              tempArray.push(element.allocation_group)
            })
          this.allocation_group = tempArray.join(", ");
        } else {
          this.allocation_group = [];
        }
        if (this.summary["ost_data"]["model_year"].length) {
          let tempArray = [];
          this.summary["ost_data"]["model_year"].map(element => 
            tempArray.push(element.model_year));
          this.model_year = tempArray.join(", ");
        } else {
          this.model_year = [];
        }

        if (this.summary["ost_data"]["vehicle_line"].length) {
          let tempArray = [];
            this.summary["ost_data"]["vehicle_line"].map(element => 
              tempArray.push(element.vehicle_line_brand));
          this.vehicle_line_brand = tempArray.join(", ");
        } else {
          this.vehicle_line_brand = [];
        }

        if (this.summary["ost_data"]["merchandizing_model"].length) {
          let tempArray = [];
          this.summary["ost_data"]["merchandizing_model"].map(element => 
            tempArray.push(element.merchandising_model));
          this.merchandising_model = tempArray.join(", ");
        } else {
          this.merchandising_model = [];
        }

        if (this.summary["ost_data"]["order_event"].length) {
          let tempArray = [];
            this.summary["ost_data"]["order_event"].map(element =>
              tempArray.push(element.order_event));
          this.order_event = tempArray.join(", ");
        } else {
          this.order_event = [];
        }

        if (this.summary["ost_data"]["order_type"].length) {
          let tempArray = [];
          this.summary["ost_data"]["order_type"].map(element =>
            tempArray.push(element.order_type))
          this.order_type = tempArray.join(", ");
        } else {
          this.order_type = [];
        }

        if (this.summary["ost_data"]["checkbox_data"].length) {
          let tempArray = [];
          this.summary["ost_data"]["checkbox_data"].map(element => {
            if (element.description_text != '') {
              tempArray.push(element.checkbox_description + "-" + element.description_text)
            }else {
              tempArray.push(element.checkbox_description)
            }
          });
          this.checkbox_data = tempArray.join(", ");
        } else {
          this.checkbox_data = [];
        }
      }

      //-----DA-----//
      if (this.summary["da_data"]) {
        if (this.summary["da_data"]["allocation_grp"].length) {
          let tempArray = [];
          this.summary["da_data"]["allocation_grp"].map(element => 
            tempArray.push(element.allocation_group));
          this.allocation_group = tempArray.join(", ");
        } else {
          this.allocation_group = [];
        }

        if (this.summary["da_data"]["model_year"].length) {
          let tempArray = [];
          this.summary["da_data"]["model_year"].map(element => 
            tempArray.push(element.model_year));
          this.model_year = tempArray.join(", ");
        } else {
          this.model_year = [];
        }

        if (this.summary["da_data"]["concensus_data"].length) {
          let tempArray = [];
          this.summary["da_data"]["concensus_data"].map(element => 
            tempArray.push(element.cd_values));
          this.concensus_data = tempArray.join(", ");
        } else {
          this.concensus_data = [];
        }

      }

      if (this.summary["bac_data"].length) {
        if (this.summary["bac_data"][0]["bac_desc"] == null) 
          this.bac_description = []
        else 
          this.bac_description = (this.summary["bac_data"][0].bac_desc).join(", ");
      }
      else {
        this.bac_description = []
      }

      if (this.summary["fan_data"].length) {
        if (this.summary["fan_data"][0]["fan_data"] == null) 
          this.fan_desc = []
        else 
          this.fan_desc = this.summary["fan_data"][0].fan_data.join(", ");
      } else {
        this.fan_desc = []
      }
      this.text_notification = this.summary["user_data"][0]['alternate_number'];
      Utils.hideSpinner();
    }, err => {
      Utils.hideSpinner();
    })
  }

  public NewReportOnSelectedCriteria() {

    this.checkbox_length  = $(".report_id_checkboxes:checkbox:checked").length;
    if (this.checkbox_length < 1) {
      this.errorModalMessageRequest = "Select at least one report";
      $('#errorModalRequest').modal('show');
    }
    else if (this.checkbox_length > 1) {
      this.errorModalMessageRequest = "Can select only one report for generating new report with same criteria";
      $('#errorModalRequest').modal('show');
    }
    else {
      this.reportDataService.setReportID($(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
      this.router.navigate(["user/submit-request/select-report-criteria"]);
      // var i = 0
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

  public getRequestId(element) {
    Utils.showSpinner();
    this.sharedDataService.setObjectExplorerPathValue(false);
    if (element.requestor != 'TBD') {
      // mimicODC here and then reroute if frequency is not ODC/OD?
      this.django.get_report_description(element.ddm_rmp_post_report_id).subscribe(response => {
        if(response){
        this.summary = response;
        let isODC = this.summary["frequency_data"][0]['select_frequency_values'];
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
          this.router.navigate(['../../semantic/sem-reports/home']);
          return;
        }
      }
      })
      // this.router.navigate(['../../semantic/'])
    }
    else {
      Utils.hideSpinner();
      this.errorModalMessageRequest = "Assign an owner first to create the report";
      $('#errorModalRequest').modal('show');
    }
  }

  public clearOnError() {
    $('.modal').modal('hide')
    $.each($("input[class='report_id_checkboxes']"), function () {
      $(this).prop("checked", false)
    });
    this.finalData = []
  }

  public postLink(request_id) {
    Utils.showSpinner();
    this.django.get_report_id(request_id).subscribe(element => {
      this.postLink_result = element;
      if (!element['report_id'].length) {
        Utils.hideSpinner();
        alert("There is no summary for this report")
      }
      else {
        let report_list_id = element['report_id'][0]['report_list_id'];
        this.django.get_report_file(request_id, report_list_id).subscribe(file_details => {
          this.file_path = file_details;
          var file_path_details = file_details["all_file_path"]["zip_url"];
          window.open(`${environment.baseUrl}` + file_path_details, '_blank');
          Utils.hideSpinner();
        })
      }
    })
  }

  public mimicODC(OdcRequestId) {
    let onDemandConfigurableRequestId = OdcRequestId.map(t => t.ddm_rmp_post_report_id);

    Utils.showSpinner();
    // using onDemandConfigurableRequestId[0] because we've an array which causes error later
    this.django.get_report_description(onDemandConfigurableRequestId[0]).subscribe(response => {
      // let isODC = this.summary["frequency_data"][0]["description"];
      let isODC = response["frequency_data"][0]['select_frequency_values'];
      this.summary = response;
      //or
      // let isODC = this.summary["frequency_value"][0]['frequency']

      if (isODC === "On Demand Configurable" || isODC === "On Demand" ) {
        // this.sharedDataService.setRequestIds(onDemandConfigurableRequestId);
        this.sharedDataService.setRequestId(onDemandConfigurableRequestId[0]);
        this.sharedDataService.setObjectExplorerPathValue(false);
        Utils.hideSpinner();
        // this.router.navigate(['../../semantic/sem-reports/home']);
      }
      else {
        Utils.hideSpinner();
        this.toastr.error("Your chosen request is not an ON DEMAND CONFIGURABLE request!");
        return;
      }
    })
  }

  public getLink(index) {
    Utils.showSpinner();
    this.django.get_report_link(index).subscribe(ele => {
      this.link_response = ele;
      window.open(ele['data']['url'], '_blank');
      Utils.hideSpinner();
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Report has not been uploaded properly,Please save/upload the report again!!");
    })

  }
  /*---------------------------Distribution List---------------------*/
  public addContact() {
    if (this.model == "") {
      this.dl_flag = true
    }
    else {
      this.contacts.push(this.model);
      this.dl_flag = false
      this.model = "";
    }
  }

  public removeContact() {
    var sList = [];
    $('.form-check-input').each(function () {
      sList.push($(this).val() + (this.checked ? "checked" : "not checked"));
    });
    var indList = []
    for (var i = 0; i < sList.length; i++) {
      if (sList[i] == "checked")
        indList.push(i);
    }

    for (var i = indList.length - 1; i >= 0; i--)
      this.contacts.splice(indList[i], 1);
  }

  public populateDl() {
    this.contacts = []
    if (this.finalData.length == 1 && (this.finalData[0].status != "Cancelled" || this.finalData[0].status != "Completed")) {
      $('#DistributionListModal').modal('show');
      Utils.showSpinner();
      let reportID = this.finalData[0]['ddm_rmp_post_report_id']
      this.django.get_report_description(reportID).subscribe(element => {
        if (element["dl_list"].length) {
            element["dl_list"].map(element => {
              this.contacts.push(element.distribution_list);
              this.dl_update.request_id = reportID;
              this.dl_update.dl_list = this.contacts;
            })
        }
        Utils.hideSpinner();
      }, err => {
        Utils.hideSpinner();
      })
    }
    else if (!this.finalData.length) {
      this.errorModalMessageRequest = "Select a report to update DL";
      $('#errorModalRequest').modal('show');
    }
    else if (this.finalData[0].status == "Cancelled" || 
              this.finalData[0].status == "Completed") {
      this.errorModalMessageRequest = "Cannot update a cancelled/completed report";
      $('#errorModalRequest').modal('show');
    }
    else {
      this.errorModalMessageRequest = "Cannot update multiple reports";
      $('#errorModalRequest').modal('show');
    }
  }
  public updateDL() {
    Utils.showSpinner();
    this.django.report_distribution_list(this.dl_update).
      subscribe(response => {
        this.toastr.success("Distribution List updated");
        $('#DistributionListModal').modal('hide');
        Utils.hideSpinner();
      }, err => {
        this.toastr.error("Server problem encountered");
        Utils.hideSpinner();
      });
  }

  public searchGlobalObj = {
    'ddm_rmp_post_report_id': this.searchText,
    'ddm_rmp_status_date': this.searchText, 
    'created_on': this.searchText, 
    'title': this.searchText, 
    'requestor': this.searchText,
    'on_behalf_of': this.searchText, 
    'assigned_to': this.searchText, 
    'status': this.searchText
  };
  

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

  public filterData() {
    if (this.statusFilter.length) 
      this.filters.status = this.statusFilter[0] ? this.statusFilter[0].status : '';
     else 
      this.filters.status = '';
    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }

  public searchUserList = (text$: Observable<string>) => {
    let vs = text$.pipe(
      debounceTime(10),
      distinctUntilChanged(),
      switchMap(term => {
        return this.django.getDistributionList(term);
      })
    )
    return vs;
  }

  public openScheduler(requestId : number){
    this.scheduleService.getScheduleReportData(requestId,1).subscribe(res=>{
      Utils.showSpinner();
        if(res){
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
    Utils.showSpinner();
    this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS');
    this.onGoingStatus.cancel_reports.push(
        { 
          'report_id': event.requestId, 
          'status': "Completed", 
          'status_date': this.date 
        });
    this.django.cancel_report(this.onGoingStatus).subscribe(response => {
      this.ongoingStatusResult = response;
      const obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(obj).subscribe(list => {
        this.reports = list["report_list"]
        Utils.hideSpinner();
        this.finalData = []
      },err=>{
        Utils.hideSpinner();
      });
    },err=>{
      Utils.hideSpinner();
    })
    //extract values andthen update ongoing status and then call refresh api
    // this.cancel_report
  }
}