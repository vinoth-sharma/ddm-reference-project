// Migrated by Ganesha
import { Component, OnInit, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ReportCriteriaDataService } from "../services/report-criteria-data.service";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js';
import { Router } from "@angular/router";
import * as Rx from "rxjs";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { AuthenticationService } from "src/app/authentication.service";
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import Utils from 'src/utils';
import '../../../assets/debug2.js';
import { MatPaginator } from '@angular/material/paginator';
declare var jsPDF: any;
declare var $: any;

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.css']
})
export class RequestStatusComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public searchText: any = '';
  public p: any;
  public frequency_flag: any;
  public comment_text: any;
  public param = "open_count";
  public orderType = 'desc';
  public fieldType = 'string';
  public enableUpdateData = false;
  public textChange = false;
  public StatusDropdownSettings = {};
  public hidVar = true;
  public column: string[];
  public reports: any = [];
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
  public contents: any;
  public enable_edits = false
  public editModes = false;
  public original_contents;
  public namings: string = "Loading";
  public lookup: any;
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
  // public showODCBtn: boolean = false;
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
  public quillToolBarDisplay = [
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
  ];
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
  public Status_List: { 'status_id': number; 'status': string; 'displayValue': string }[];
  public setbuilder_sort: any[];
  public statusFilter = [];
  public filters = {
    global: '',
    status: ''
  };
  public onGoingStatus = {
    "cancel_reports": []
  };
  public searchObj: any;
  public config = {
    toolbar: null
  };
  public errorModalMessageRequest = '';
  public documentName: any = '';
  public documentUrl: any = '';
  public readOnlyContentHelper = true;
  public cancel_response: any;
  public link_response: any;
  public ongoingStatusResult: any;
  public checkbox_length: number;
  public assign_res: any;
  public Tbd_res: any;
  public assigned_res: any;
  public add_response: any;
  public tbd_assign_res: any;
  public linkUrlId: number
  public addUrlTitle: String = "";
  public selectedReportStatus = "";
  public changeDoc: boolean = false;
  public linkToUrlFlag = true;


  public paginatorLowerValue = 0;
  public paginatorHigherValue = 10;
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
  public updateDLReportId: number;
  public distribution_data: string;
  public dl_list: any = [];
  public is_vin_level_report: any;
  public is_summary_report: any;

  public globalSearch = "";
  public searchFields = {
    ddm_rmp_post_report_id: "",
    created_on1: "",
    requestor: "",
    on_behalf_of: "",
    title: "",
    frequency: "",
    assigned_to: "",
    status: "",
    ddm_rmp_status_date1: ""
  }
  public sortFields = {
    ddm_rmp_post_report_id: "",
    created_on: "",
    requestor: "",
    on_behalf_of: "",
    title: "",
    frequency: "",
    assigned_to: "",
    status: "",
    ddm_rmp_status_date: ""
  }

  // paginator params
  public paginatorpageSize = 10;
  public paginatorOptions: number[] = [5, 10, 25, 100];
  public totalRecords = 0;

  statusMasterData = ["Incomplete", "Pending", "In Process", "Completed", "Freq Chg", "Cancelled"]

  constructor(private generated_id_service: GeneratedReportService,
    private router: Router,
    private reportDataService: ReportCriteriaDataService,
    private django: DjangoService, private DatePipe: DatePipe,
    private dataProvider: DataProviderService,
    private auth_service: AuthenticationService,
    private toastr: NgToasterComponent) {
    Utils.showSpinner();
    this.getCurrentNotifications();
    this.model = "";
    this.getRoleDetails();
    this.Status_List = [
      { 'status_id': 1, 'status': 'Incomplete', 'displayValue': "Incomplete" },
      { 'status_id': 2, 'status': 'Pending', 'displayValue': "Pending" },
      { 'status_id': 3, 'status': 'Active', 'displayValue': "In Process" },
      { 'status_id': 4, 'status': 'Completed', 'displayValue': "Completed" },
      { 'status_id': 5, 'status': 'Recurring', 'displayValue': "Freq Chg" },
      { 'status_id': 6, 'status': 'Cancelled', 'displayValue': "Cancelled" }
    ];
    this.contacts = [];
    this.currentLookUpTableData();
  }

  //get current notification details
  public getCurrentNotifications() {
    this.dataProvider.currentNotifications.subscribe((element: Array<any>) => {
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

  // get user details
  public getRoleDetails() {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_name = role["first_name"] + " " + role["last_name"];
        this.user_role = role["role"];
        this.self_email = role["email"];
        if (this.user_role == "Admin") this.config.toolbar = this.quillToolBarDisplay;
        else this.config.toolbar = false;
      }
    });
  }

  // get report list of user
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
        if (temps) this.original_contents = temps.description;
        else this.original_contents = "";
        this.namings = this.original_contents;
        this.generated_id_service.changeButtonStatus(false);
        // this.getReportDetails();
        this.getRequestListHttp({ page_no: 1, page_size: this.paginatorpageSize });
      }
    });
  }

  public getReportDetails() {
    const obj = { 'sort_by': '', 'page_no': 1, 'per_page': 200 }
    this.django.list_of_reports(obj).subscribe(list => {
      list["report_list"].forEach(element => {
        if (this.setbuilder_sort && this.setbuilder_sort.includes(element.ddm_rmp_post_report_id))
          element['unread'] = true;
        else element['unread'] = false;

        element['created_on'] = this.DatePipe.transform(element['created_on'], 'dd-MMM-yyyy')
        element['ddm_rmp_post_report_id'] = isNaN(+element['ddm_rmp_post_report_id']) ? 99999 : +element['ddm_rmp_post_report_id'];
        element['ddm_rmp_status_date'] = this.DatePipe.transform(element['ddm_rmp_status_date'], 'dd-MMM-yyyy')

        if (element && element.isChecked) element.isChecked = false;
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

  public ngOnInit() {
    // get lookup values
    this.django.getLookupValues().subscribe(check_user_data => {
      check_user_data['data']['users_list'].forEach(ele => {
        this.fullName = ele.first_name + ' ' + ele.last_name;
        this.usersList.push({ 'full_name': this.fullName, 'users_table_id': ele.users_table_id, role: ele.role });

        if (ele['disclaimer_ack'] != null || ele['disclaimer_ack'] != undefined)
          this.ackList['data'].push(ele);
      });
      this.tbddropdownListfinalAssigned = this.usersList.filter(item => item.role == 1);;
      this.tbddropdownListfinal_report = this.usersList
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
      labelKey: 'displayValue',
    };
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

  // detect paramater changes in component
  public ngOnChanges() {
    let s = $(".report_id_checkboxes:checkbox:checked").length;
  }

  // detect changes in quill editor
  public textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  // saving edited content in help pop-up
  public content_edits() {
    if (!this.textChange || this.enableUpdateData) {
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
          $('#helpModal').modal('hide');
          Utils.hideSpinner();
        }, err => {
          Utils.hideSpinner();
          this.toastr.error("Data not Updated")
        })
    }
    else {
      this.toastr.error("please enter the data");
    }
  }

  // reset the help model params 
  public resetHelpParams() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_contents;
  }

  // enable edit params of help model
  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_contents;
  }

  // supdated the order type
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

  // get the details of checked report
  public Report_request(element, event) {
    this.cancel = element.ddm_rmp_post_report_id;
    // this.showODCBtn = element['status'] === 'Active' ? true : false;
    this.reports.forEach(ele => {
      if (ele.ddm_rmp_post_report_id === element.ddm_rmp_post_report_id) {
        this.finalData = [ele];
        ele.isChecked = event.target.checked;
      } else ele.isChecked = false;
    });
  }

  public DealerAllocation(event) {
  }

  public OrderToSale(event) {
  }

  // check status of selected report and take action on based on status
  public CheckCancel() {
    this.finalData = [];
    if ($(".report_id_checkboxes:checkbox:checked").length) {
      this.reports.find(e => {
        if (e.isChecked) {
          if (e.status == "Cancelled") {
            this.errorModalMessageRequest = "Request #" + e.ddm_rmp_post_report_id + " is already cancelled";
            $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
            this.finalData = [];
          }
          else {
            this.finalData = [e];
            if ($(".report_id_checkboxes:checkbox:checked").length) {
              if (e.status == "Incomplete" || e.status == "Pending") {
                $('#CancelRequest').modal('hide');
                $('#CancelPermanently').modal({ backdrop: "static", keyboard: true, show: true });
              }
              else if (e.status == "Completed" || e.status == "Active" ||
                e.status == "Recurring") {
                $('#CancelPermanently').modal('hide');
                $('#CancelRequest').modal({ backdrop: "static", keyboard: true, show: true });
              }
            }
            else if (!$(".report_id_checkboxes:checkbox:checked").length) {
              this.errorModalMessageRequest = "Select a report to Cancel";
              $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
            }
            else {
              this.errorModalMessageRequest = "Cannot cancel multiple reports";
              $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
            }
          }
        }
      });
    }
    else {
      this.errorModalMessageRequest = " Please select a checkbox to perform 'Cancel/Reassign' operation!";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
      this.finalData = [];
    }
  }

  // changing status of report to cancelled
  public Cancel() {
    Utils.showSpinner();
    this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS');
    this.cancel_report.cancel_reports.push({
      'report_id': this.finalData[0]['ddm_rmp_post_report_id'],
      'status': "Cancelled",
      'status_date': this.date
    });

    this.django.cancel_report(this.cancel_report).subscribe(response => {
      this.cancel_response = response;
      $('#CancelRequest').modal('hide');
      this.toastr.success("The request-id : " + this.finalData[0]['ddm_rmp_post_report_id'] + " has been cancelled successfully")
      Utils.hideSpinner();
      this.comment_text = "Cancelled";
      this.extract_comment(true);
      //Refresh Request data from Backend
      this.resetSearchSort();
      this.getRequestListHttp({ page_no: 1, page_size: this.paginatorpageSize });
    },
      err => {
        this.toastr.error("There has been an error in cancelling the request-id : " + this.finalData[0]['ddm_rmp_post_report_id'])
        Utils.hideSpinner();
      })
  }

  public closeCancel() {
    this.finalData = [];
  }

  public closeCancel_modal() {
    this.finalData = [];
    $('#CancelRequest').modal('hide');
  }

  public AssignTBD() {
    Utils.showSpinner();
    this.assignTBD['request_id'] = this.finalData[0]['ddm_rmp_post_report_id'];
    this.assignTBD['requestor'] = 'TBD';
    this.django.ddm_rmp_tbd_req_put(this.assignTBD).subscribe(response => {
      this.assign_res = response;
      Utils.hideSpinner();
      this.finalData = [];
      this.toastr.success("Updated Successfully")
      $('#CancelRequest').modal('hide');
      //Refresh Request data from Backend
      this.resetSearchSort();
      this.getRequestListHttp({ page_no: 1, page_size: this.paginatorpageSize });
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Server Error")
    })
  }

  // get selected element id
  public TBD(element) {
    this.assignReportId = element.ddm_rmp_post_report_id;
  }

  // update report successfullys
  public TBDsave() {
    Utils.showSpinner();
    this.assignOwner['request_id'] = this.assignReportId;
    this.assignOwner['users_table_id'] = this.tbdselectedItems_report[0]['users_table_id'];
    this.assignOwner['requestor'] = this.tbdselectedItems_report[0]['full_name'];

    this.django.assign_owner_post(this.assignOwner).subscribe(ele => {
      this.Tbd_res = ele;
      const obj = { 'sort_by': '', 'page_no': 1, 'per_page': 6 }
      this.django.list_of_reports(obj).subscribe(list => {
        this.reports = list["report_list"];
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

  // updating Assign Acceptor of request
  public Assign_AssignTo() {
    Utils.showSpinner();
    this.assignOwner_Assigned['request_id'] = this.finalData[0]['ddm_rmp_post_report_id'];
    this.assignOwner_Assigned['assigned_to'] = 'TBD';
    this.django.ddm_rmp_assign_to(this.assignOwner_Assigned).subscribe(ele => {
      this.assigned_res = ele;
      Utils.hideSpinner();
      this.finalData = [];
      $('#CancelRequest').modal('hide');
      this.toastr.success("Updated Successfully");
      //Refresh Request data from Backend
      this.resetSearchSort();
      this.getRequestListHttp({ page_no: 1, page_size: this.paginatorpageSize });
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Server Error");
    })
    this.tbdselectedItemsAssigned = [];
  }

  // updating TBD_Assigned of request
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

  // sort reports based on ascending or descending order
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

  // converting status into Active of reports
  public Accept() {
    if ($(".report_id_checkboxes:checkbox:checked").length) {
      if (this.finalData[0].status == "Cancelled") {
        this.errorModalMessageRequest = 'status for the report ' + this.finalData[0].ddm_rmp_post_report_id + ' is already Cancelled and can not be accepted';
        $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
        this.finalData = [];
      }
      else if (this.finalData[0].status == "Incomplete") {
        this.errorModalMessageRequest = 'Status for the report ' + this.finalData[0].ddm_rmp_post_report_id + ' is Incomplete and cannot be accepted. Please complete the request';
        $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
        this.finalData = [];
      } else {
        if ($(".report_id_checkboxes:checkbox:checked").length) {
          Utils.showSpinner();
          this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS');
          this.accept_report.accept_reports = [];
          this.accept_report.accept_reports.push(
            {
              'report_id': this.finalData[0]['ddm_rmp_post_report_id'],
              'assign_to': this.user_name, 'status_date': this.date,
              'status': 'Active'
            });

          this.django.accept_report(this.accept_report).subscribe(response => {
            this.toastr.success("Status Changed to Active");
            Utils.hideSpinner();
            this.finalData = [];
            //Refresh Request data from Backend
            this.resetSearchSort();
            this.getRequestListHttp({ page_no: 1, page_size: this.paginatorpageSize });
          }, err => {
            this.toastr.error("Server Error")
            Utils.hideSpinner();
          })

        }
        else if (!$(".report_id_checkboxes:checkbox:checked").length) {
          this.errorModalMessageRequest = "Select a report to Accept";
          $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
        }
      }
    }
    else {
      this.errorModalMessageRequest = "Please select a checkbox to perform 'Accept Assignment' operation!";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
      this.finalData = [];
    }
  }

  // formating date 
  public dateFormat(str: any) {
    const date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("");
  }

  // download list of reports into excel sheet
  public xlsxJson() {
    let fileName = "Request_" + this.dateFormat(new Date()); // changes done by Ganesh
    xlsxPopulate.fromBlankAsync().then(workbook => {
      const EXCEL_EXTENSION = '.xlsx';
      const wb = workbook.sheet("Sheet1");
      const headings = ["Request Number", "Created On", "Requestor", "On Behalf Of", "Title", "Frequency", "Assigned To", "Status", "Status Date"]
      const reportBody = this.createNewBodyForExcel()
      headings.forEach((heading, index) => {
        const cell = `${String.fromCharCode(index + 65)}1`;
        wb.cell(cell).value(heading)
      });
      const transformedData = reportBody.map(item => (headings.map(key => item[key] instanceof Array ? item[key].join(",") : item[key])))
      const colA = wb.cell("A2").value(transformedData);
      workbook.outputAsync().then(function (blob) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob,
            fileName + EXCEL_EXTENSION
          );
        }
        else {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = fileName + EXCEL_EXTENSION;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a)
        }
      }).catch(error => {
      });
    }).catch(error => {
    });
  }

  // creating a body to generate excel report
  public createNewBodyForExcel() {
    let reportBody = []
    this.reports.forEach(item => {
      let obj = {
        "Request Number": item["ddm_rmp_post_report_id"],
        "Created On": item["created_on"],
        "Requestor": item["requestor"],
        "On Behalf Of": item["on_behalf_of"],
        "Title": item["title"],
        "Frequency": item["frequency"],
        "Assigned To": item["assigned_to"],
        "Status": item["status"],
        "Status Date": new Date(item["ddm_rmp_status_date"]).toDateString()
      }
      reportBody.push(obj)
    })
    return reportBody
  }

  public post_link() {
    this.checkbox_length = $(".report_id_checkboxes:checkbox:checked").length;
    if (this.checkbox_length == 0) {
      this.errorModalMessageRequest = "Select a report to post link for it";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
    }
    else if (this.checkbox_length > 1) {
      this.errorModalMessageRequest = "You cannot post link on multiple reports at once";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
      this.finalData = [];
    } else if (this.checkbox_length == 1) {
      if (this.finalData[0].status != "Active") {
        this.errorModalMessageRequest = "Request not Active yet. Can't post link to results.";
        $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
        this.finalData = [];
      } else if (this.finalData[0].status == "Active" ||
        this.finalData[0].status == "Completed") { }
      $("#post_link_button:button").trigger('click');
    }
  }

  public closePostLink() {
    this.hidVar = true;
  }

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
        $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
      }
    }
  }

  // check validation of reports to avoid multiple select
  public checkbox_validation() {
    this.checkbox_length = $(".report_id_checkboxes:checkbox:checked").length;

    if (this.checkbox_length > 1) {
      this.errorModalMessageRequest = "You cannot comment on multiple reports at once";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
    }
    else if (this.checkbox_length == 0) {
      this.errorModalMessageRequest = "Select a report to comment on it";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
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

  // adding comment to reports
  public extract_comment(calledFormDeleteReq?) {
    if (!this.comment_text || this.comment_text == "") {
      this.errorModalMessageRequest = "Enter some comment";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
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
            if (!calledFormDeleteReq) {
              this.toastr.success('Comments for request-id :' + report_comment.ddm_rmp_post_report + ' saved successfully!')
            }
            Utils.hideSpinner();
          }, err => {
            if (!calledFormDeleteReq) {
              this.errorModalMessageRequest = "Please post the comment again";
            }
            $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
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
            this.notification_list = response
            this.notification_list.map(element => {
              if (element.ddm_rmp_post_report == report_id) {
                element.comment_read_flag = true
              }
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

  // changes done by Ganesh
  // displaying details of pop-up of selected report
  public query_criteria_click(query_report_id) {
    Utils.showSpinner();
    this.django.get_report_description(query_report_id).subscribe(response => {
      this.is_vin_level_report = response['report_data']['is_vin_level_report'];
      this.is_summary_report = response['report_data']['is_summary_report'];
      if (response["market_data"].length) {
        let tempArray = [];
        response["market_data"].map(element => tempArray.push(element.market));
        this.market_description = tempArray.join(", ");
      } else {
        this.market_description = [];
      }

      if (response["country_region_data"].length) {
        let tempArray = [];
        response["country_region_data"].
          map(element => tempArray.push(element.region_desc));
        this.region_description = tempArray.join(", ");
      } else {
        this.region_description = [];
      }

      if (response["region_zone_data"].length) {
        let tempArray = [];
        response["region_zone_data"].map(element =>
          tempArray.push(element.zone_desc))
        this.zone_description = tempArray.join(", ");
      } else {
        this.zone_description = [];
      }

      if (response["zone_area_data"].length) {
        let tempArray = [];
        response["zone_area_data"].map(element =>
          tempArray.push(element.area_desc))
        this.area_description = tempArray.join(", ");
      } else {
        this.area_description = [];
      }

      if (response["lma_data"].length) {
        let tempArray = [];
        response["lma_data"].map(element =>
          tempArray.push(element.lmg_desc));
        this.lma_description = tempArray.join(", ");
      } else {
        this.lma_description = [];
      }

      if (response["gmma_data"].length) {
        let tempArray = [];
        response["gmma_data"].map(element =>
          tempArray.push(element.gmma_desc));
        this.gmma_description = tempArray.join(", ");
      } else {
        this.gmma_description = [];
      }

      if (response["frequency_data"].length) {
        let tempArray = [];
        this.frequency_flag = true;
        response["frequency_data"].map(element => {
          tempArray.push(element.select_frequency_values);
        });
        this.report_frequency = tempArray.join(", ");
      } else {
        this.report_frequency = [];
        this.frequency_flag = false;
      }

      if (response["division_dropdown"].length) {
        let tempArray = [];
        response["division_dropdown"].map(element =>
          tempArray.push(element.division_desc));
        this.division_dropdown = tempArray.join(", ");
      } else {
        this.division_dropdown = []
      }

      if (response["special_identifier_data"].length) {
        let tempArray = [];
        response["special_identifier_data"].map(element => {
          tempArray.push({
            label: element.spl_desc,
            value: 'Yes'
          })
        });
        this.special_identifier = tempArray;
      } else {
        this.special_identifier = [];
      }

      if (response["ost_data"]) {
        if (response["ost_data"]["allocation_group"].length) {
          let tempArray = [];
          response["ost_data"]["allocation_group"].map(element => {
            tempArray.push(element.allocation_group)
          })
          this.allocation_group = tempArray.join(", ");
        } else {
          this.allocation_group = [];
        }
        if (response["ost_data"]["model_year"].length) {
          let tempArray = [];
          response["ost_data"]["model_year"].map(element =>
            tempArray.push(element.model_year));
          this.model_year = tempArray.join(", ");
        } else {
          this.model_year = [];
        }

        if (response["ost_data"]["vehicle_line"].length) {
          let tempArray = [];
          response["ost_data"]["vehicle_line"].map(element =>
            tempArray.push(element.vehicle_line_brand));
          this.vehicle_line_brand = tempArray.join(", ");
        } else {
          this.vehicle_line_brand = [];
        }

        if (response["ost_data"]["merchandizing_model"].length) {
          let tempArray = [];
          response["ost_data"]["merchandizing_model"].map(element =>
            tempArray.push(element.merchandising_model));
          this.merchandising_model = tempArray.join(", ");
        } else {
          this.merchandising_model = [];
        }

        if (response["ost_data"]['distribution_data'].length) {
          let tempArray = [];
          response["ost_data"]["distribution_data"].map(element =>
            tempArray.push(element.value));
          this.distribution_data = tempArray.join(',');
        }

        if (response["ost_data"]["order_event"].length) {
          let tempArray = [];
          response["ost_data"]["order_event"].map(element =>
            tempArray.push(element.order_event));
          this.order_event = tempArray.join(", ");
        } else {
          this.order_event = [];
        }

        if (response["ost_data"]["order_type"].length) {
          let tempArray = [];
          response["ost_data"]["order_type"].map(element =>
            tempArray.push(element.order_type))
          this.order_type = tempArray.join(", ");
        } else {
          this.order_type = [];
        }

        if (response["ost_data"]["checkbox_data"].length) {
          let group = [];
          response["ost_data"]["checkbox_data"].map(ele => {
            if (ele.ddm_rmp_lookup_ots_checkbox_values === 27 || ele.ddm_rmp_lookup_ots_checkbox_values === 55) {
              group.push('Turn rate:' + ele.checkbox_description)
            } else group.push(ele.checkbox_description)
          })
          this.checkbox_data = group.join(',');
        } else {
          this.checkbox_data = [];
        }
      }

      //-----DA-----//
      if (response["da_data"]) {
        if (response["da_data"]["allocation_grp"].length) {
          let tempArray = [];
          response["da_data"]["allocation_grp"].map(element =>
            tempArray.push(element.allocation_group));
          this.allocation_group = tempArray.join(", ");
        } else {
          this.allocation_group = [];
        }

        if (response["da_data"]["model_year"].length) {
          let tempArray = [];
          response["da_data"]["model_year"].map(element =>
            tempArray.push(element.model_year));
          this.model_year = tempArray.join(", ");
        } else {
          this.model_year = [];
        }

        if (response["da_data"]["concensus_data"].length) {
          let tempArray = [];
          response["da_data"]["concensus_data"].map(element =>
            tempArray.push(element.cd_values));
          this.concensus_data = tempArray.join(", ");
        } else {
          this.concensus_data = [];
        }
      }

      if (response["bac_data"].length) {
        if (response["bac_data"][0]["bac_desc"] == null)
          this.bac_description = []
        else {
          let bacData = []
          response["bac_data"][0]["bac_desc"].map(d => bacData.push("'" + d + "'"));
          this.bac_description = bacData.join(", ");
        }

      }
      else {
        this.bac_description = []
      }

      if (response["fan_data"].length) {
        if (response["fan_data"][0]["fan_data"] == null)
          this.fan_desc = []
        else {
          let fanData = [];
          response["fan_data"][0]["fan_data"].map(d => fanData.push("'" + d + "'"));
          this.fan_desc = fanData.join(", ");
        }
      } else {
        this.fan_desc = []
      }

      if (response['dl_list'].length) {
        let list = [];
        response['dl_list'].map(element => list.push(element['distribution_list']))
        this.dl_list = list;
      }
      this.text_notification = response["user_data"][0]['alternate_number'];
      this.summary = response;
      Utils.hideSpinner();
    }, err => {
      Utils.hideSpinner();
    })
  }

  // create new request for selected reports
  public NewReportOnSelectedCriteria() {
    this.checkbox_length = $(".report_id_checkboxes:checkbox:checked").length;
    if (this.checkbox_length < 1) {
      this.errorModalMessageRequest = "Select at least one report";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
    }
    else if (this.checkbox_length > 1) {
      this.errorModalMessageRequest = "Can select only one report for generating new report with same criteria";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
    }
    else {
      localStorage.setItem('report_id', $(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
      this.reportDataService.setReportID($(".report_id_checkboxes[type=checkbox]:checked").prop('id'));
      this.router.navigate(["user/submit-request"]);
    }
  }

  // displaying alert message
  public clearOnError() {
    $('.modal').modal('hide')
    $.each($("input[class='report_id_checkboxes']"), function () {
      $(this).prop("checked", false)
    });
    this.finalData = []
  }

  // get the response of link to result
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

  // add list of contacts
  public addContact() {
    if (this.model == "") {
      this.dl_flag = true
    }
    else {
      if (!this.contacts.includes(this.model)) {
        this.contacts.push(this.model);
        this.dl_flag = false
        this.model = "";
      }
      else {
        this.toastr.error("Please enter a unique email-id for the Distribution List!");
      }
    }
  }

  // remove the contact from the list
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
      $('#DistributionListModal').modal({ backdrop: "static", keyboard: true, show: true });
      Utils.showSpinner();
      this.updateDLReportId = this.finalData[0]['ddm_rmp_post_report_id']
      this.django.get_report_description(this.updateDLReportId).subscribe(element => {
        if (element["dl_list"].length) {
          element["dl_list"].map(element => {
            this.contacts.push(element.distribution_list);
            this.dl_update.request_id = this.updateDLReportId;
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
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
    }
    else if (this.finalData[0].status == "Cancelled" ||
      this.finalData[0].status == "Completed") {
      this.errorModalMessageRequest = "Cannot update a cancelled/completed report";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
    }
    else {
      this.errorModalMessageRequest = "Cannot update multiple reports";
      $('#errorModalRequest').modal({ backdrop: "static", keyboard: true, show: true });
    }
  }

  // update the modified distributiion list
  public updateDL() {
    Utils.showSpinner();
    this.dl_update.request_id = this.updateDLReportId;
    this.dl_update.dl_list = this.contacts;
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

  // Search by Request Number/Requestor/Title/Status
  public filterData() {
    if (this.statusFilter.length) {
      this.filters.status = this.statusFilter[0] ? this.statusFilter[0].status : '';
    }
    else {
      this.filters.status = '';
    }
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

  // update status of report to completed state 
  public updateMarkAsComplete(requestId: number) {
    Utils.showSpinner();
    this.date = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS');
    this.onGoingStatus.cancel_reports.push(
      {
        'report_id': requestId,
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
      }, err => {
        Utils.hideSpinner();
      });
    }, err => {
      Utils.hideSpinner();
    })
  }

  // download browser data in pdf file
  public captureScreen() {
    let fileName = `${this.summary.ddm_rmp_post_report_id}_Request_Summary.pdf`;
    var specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    var doc = new jsPDF();
    doc.setFont("arial");
    let margins = {
      top: 15,
      bottom: 0,
      left: 18,
      width: 170
    };
    doc.fromHTML(
      $('#print').html(), margins.left, margins.top,
      { 'width': 170, 'elementHandlers': specialElementHandlers, 'top_margin': 15 },
      function () { doc.save(fileName); }, margins
    );
  }

  // capture pagination page event
  public addLinkUrl(element, type) {
    this.linkUrlId = element.ddm_rmp_post_report_id;
    if (type == "create") {
      this.addUrlTitle = "Add URL"
      document.querySelector("#add-url-input")["value"] = "";
    }
    else {
      this.addUrlTitle = "Edit URL"
      document.querySelector("#add-url-input")["value"] = element.link_to_results;
      this.validateLinkToUrl(element.link_to_results)
    }
  }

  //  save link to url
  public saveLinkURL() {
    let link = document.querySelector("#add-url-input")["value"]
    let data = { request_id: this.linkUrlId, link_to_results: link }
    Utils.showSpinner();
    this.django.add_link_to_url(data).subscribe(response => {
      if (response['message'] == "updated successfully") {
        document.querySelector("#add-url-input")["value"] = "";
        $('#addUrl').modal('hide');
        this.toastr.success("URL Updated Successfully !")
        Utils.hideSpinner()
        this.reports.map(item => {
          if (item.ddm_rmp_post_report_id == this.linkUrlId) {
            item.link_to_results = link
          }
        })
      }
    }, error => {
      this.toastr.error(error.error.error.link_to_results.join())
      Utils.hideSpinner()
    })
  }

  // open link in a new window
  public openNewWindow(url) {
    window.open(url)
  }

  // setting report id inorder to edit
  public openEditStatusModal(element) {
    this.linkUrlId = element.ddm_rmp_post_report_id;
    document.querySelector("#selectReportStatus")["value"] = "Active";
    this.selectedReportStatus = "Active";
  }

  // // capturing report status from input
  // public setselectReportStatus() {
  //   this.selectReportStatus = document.querySelector("#selectReportStatus")["value"]
  // }

  // saving report status to server
  public saveReportStatus() {
    let link = document.querySelector("#add-url-input")["value"]
    let data = { request_id: this.linkUrlId, status: "Completed", status_date: new Date() }
    Utils.showSpinner();
    this.django.update_report_status(data).subscribe(response => {
      if (response['message'] == "updated successfully") {
        $('#changeStatusModal').modal('hide');
        this.toastr.success("Status updated Successfully !")
        Utils.hideSpinner();
        //Refresh Request data from Backend
        this.resetSearchSort();
        this.getRequestListHttp({ page_no: 1, page_size: this.paginatorpageSize });

        // this.reports.map(item => {
        //   if (item.ddm_rmp_post_report_id == this.linkUrlId) {
        //     item.status = "Completed"
        //     item.ddm_rmp_status_date = new Date()
        //   }
        // })
      }
    }, error => {
      this.toastr.error("Failed To Change Status, Please Try Again")
      Utils.hideSpinner()
    })
  }

  // close modal
  public closeLinkUrl() {
    $('#addUrl').modal('hide');
  }

  // close modal
  public closeStatusUrl() {
    $('#changeStatusModal').modal('hide');
  }

  // used to validate weather input is empty or not
  public validateLinkToUrl(data) {
    if (data == "") this.linkToUrlFlag = true
    else this.linkToUrlFlag = false;
  }

  // public onPaginationChange(event) {
  //   console.log(event);

  //   this.paginatorLowerValue = event.pageIndex * event.pageSize;
  //   this.paginatorHigherValue = event.pageIndex * event.pageSize + event.pageSize;
  // }

  public searchColumn(type) {

    if (type === "search" || type === "sort") {
      this.paginator.pageIndex = 0;
    }
    else if (type === 'paginator') {
      if (this.paginator.pageSize !== this.paginatorpageSize) {
        this.paginatorpageSize = this.paginator.pageSize;
        this.paginator.pageIndex = 0;
      }
    }

    let body = {
      page_no: this.paginator.pageIndex + 1,
      page_size: this.paginator.pageSize
    };

    if (this.globalSearch.trim()) {
      body['main_search'] = {
        value: this.globalSearch
      }
    }

    let l_body = {};
    for (const key in this.searchFields) {
      if (this.searchFields.hasOwnProperty(key)) {
        const element = this.searchFields[key];
        if (element.trim()) {
          l_body[key] = element;
        }
      }
    }

    if (Object.keys(l_body).length) {
      body['col_search'] = l_body
    }

    for (const col in this.sortFields) {
      if (this.sortFields.hasOwnProperty(col)) {
        let value = this.sortFields[col];
        if (value)
          body['sort_filter'] = { col_val: col, sort_type: value }
      }
    }


    console.log(body);
    this.getRequestListHttp(body);
  }

  sortRequestData(column) {
    let l_order = "";
    if (this.sortFields[column] === 'Asc')
      l_order = "Desc";
    else if (this.sortFields[column] === 'Desc')
      l_order = "Asc";
    else
      l_order = "Asc";

    for (const col in this.sortFields) {
      if (this.sortFields.hasOwnProperty(col)) {
        this.sortFields[col] = ""
      }
    }

    this.sortFields[column] = l_order;
    this.searchColumn("sort");
  }

  public getRequestListHttp(body) {
    Utils.showSpinner();
    this.django.list_of_requests(body).subscribe((list: any) => {
      this.totalRecords = list.row_count;
      list["data"].forEach(element => {
        if (element && element.isChecked) element.isChecked = false;
      });
      this.reports = list["data"];
      Utils.hideSpinner();
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Server Error")
    });
  }

  resetSearchSort() {
    this.globalSearch = "";
    this.paginatorpageSize = 10;
    this.paginator.pageIndex = 0;
    for (const col in this.searchFields) {
      if (this.searchFields.hasOwnProperty(col)) {
        this.searchFields[col] = ""
      }
    }
    for (const col in this.sortFields) {
      if (this.sortFields.hasOwnProperty(col)) {
        this.sortFields[col] = ""
      }
    }
  }
}