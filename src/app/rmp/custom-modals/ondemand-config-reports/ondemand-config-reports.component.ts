import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgToasterComponent } from "../../../custom-directives/ng-toaster/ng-toaster.component";

import Utils from "../../../../utils";
import { ScheduleService } from '../../../schedule/schedule.service';
import { OndemandService } from '../ondemand.service';

@Component({
  selector: 'app-ondemand-config-reports',
  templateUrl: './ondemand-config-reports.component.html',
  styleUrls: ['./ondemand-config-reports.component.css']
})

export class OndemandConfigReportsComponent implements OnInit {

  public odcRequestNumber: any = '';
  public odcTitle: any = '';
  public odcName: any = '';
  public odcReportId: any;
  public odcSheetId: any;
  public odcColumns: any;
  public odcRecievedDetails: any;
  public isLoading: boolean = true;
  public onDemandConfigureScheduleId: any;
  public odcInfoObject: any;
  public saveSettingsData: any;
  public miniSpinner: boolean = false;
  public sheetNames: any

  @Input() requestNumber: any;
  @Input() title: any;
  @Input() name: any;
  @Input() details: any = {};
  @Input() reportId: any;

  @Output() odcScheduleConfirmation = new EventEmitter();

  public odcData = {
    sheet_id: '',
    request_id: '',
    report_list_id: '',
    parameter_json: []
  };

  constructor(public scheduleService: ScheduleService,
    public router: Router,
    private toasterService: NgToasterComponent,
    private onDemandService: OndemandService) { }

  ngOnInit() {
    this.isLoading = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.isLoading = true;
    this.odcRequestNumber = this.requestNumber;
    this.odcTitle = this.title;
    this.odcName = this.name;
    this.odcReportId = this.reportId;

    if (this.odcReportId != undefined && this.odcReportId != null && this.odcRequestNumber != undefined && this.odcRequestNumber != null) {
      this.onDemandService.getOnDemandConfigDetails(this.odcReportId, this.odcRequestNumber).subscribe(res => {
        this.odcRecievedDetails = res;
        this.sheetNames = this.odcRecievedDetails['data'].map(i => i.sheet_name);
        this.onDemandConfigureScheduleId = this.odcRecievedDetails['data'].splice(-1).map(i => i.schedule_id)
        this.onDemandConfigureScheduleId = this.onDemandConfigureScheduleId[0][0]
        if (!this.onDemandConfigureScheduleId) {
          this.toasterService.error('Please ask the admin to configure scheduling parameters!');
          return;
        }
        this.sheetNames.unshift('');
        this.sheetNames.splice(-1);
        this.isLoading = false;
      })
    }
  }

  public setSheetValues(event: any) {
    this.miniSpinner = true;
    let sheetName = event.currentTarget.value;
    if (sheetName) {
      // getting the sheetId for final submission
      this.odcRecievedDetails['data'].map(i => { if (i.sheet_name == sheetName) { this.odcSheetId = i.sheet_id } });

      this.onDemandService.getSaveSettingsValues(this.odcSheetId, this.odcRequestNumber).subscribe(res => {
        let resultData = res['data'].splice(-1);
        this.saveSettingsData = resultData.map(i => i.fields);
        this.miniSpinner = false;
      })

      /// fetch respective details from the dupebody/dynamic data
      let columnProperties;
      this.odcRecievedDetails['data'].map(i => {
        if (i.sheet_name === sheetName) {
          columnProperties = i.column_properties;
        }
      })
      this.odcColumns = columnProperties.map(i => i.mapped_column);
    }
    else {
      this.toasterService.error('Error in fetching sheet details!');
    }
  }


  public updateOnDemandConfigurable() {

    let odcValues = document.getElementsByClassName("odcValues");
    let odcValuesArray = [].slice.call(odcValues)

    // let odcValuesFinal= odcValuesArray.map(i=> i.firstChild.value) // ALTERNATE TRY DUE TO OBJECT VARIATIONS
    let odcValuesFinal = odcValuesArray.map(i => i.children[0].value)

    // getting the parameterJson
    let parameterJson = odcValuesFinal.map((d, i) => {
      var myObj = {};
      myObj[this.odcColumns[i]] = d;
      return myObj;
    })

    this.odcData = {
      sheet_id: this.odcSheetId,
      request_id: this.odcRequestNumber,
      report_list_id: this.odcReportId,
      parameter_json: parameterJson
    };

    this.onDemandService.postOnDemandConfigDetails(this.odcData).subscribe(res => {
      Utils.showSpinner();
      if (this.onDemandConfigureScheduleId) {
        this.odcInfoObject = { confirmation: true, type: 'On Demand Configurable', scheduleId: this.onDemandConfigureScheduleId, status: true }
      }
      else {
        this.odcInfoObject = { confirmation: true, type: 'On Demand Configurable', scheduleId: this.onDemandConfigureScheduleId, status: false }
      }
      this.odcScheduleConfirmation.emit(this.odcInfoObject);
      if (res) {
        this.onDemandService.refreshSaveSettingsValues(this.odcData.sheet_id, this.odcData.request_id).subscribe(res => {
          this.toasterService.success('Configured parameters are added to query successfully');
          Utils.hideSpinner();
        })
      }
    }, error => {
      this.toasterService.error('Configured parameters are cannot be added');
    });
  }

  public updateSaveSettings() {

    let saveSettingsValues = document.getElementsByClassName("odcValues");
    let saveSettingsValuesArray = [].slice.call(saveSettingsValues)
    let saveSettingsValuesFinal = saveSettingsValuesArray.map(i => i.children[0].value)

    let saveSettingsrequestBody = {
      request_id: this.odcRequestNumber,
      sheet_id: this.odcSheetId,
      fields: saveSettingsValuesFinal
    }

    // separating the post and put calls now
    if (JSON.stringify(this.saveSettingsData[0]) === JSON.stringify(saveSettingsValuesFinal)) {
      this.onDemandService.postSaveSettings(saveSettingsrequestBody).subscribe(res => {
        Utils.showSpinner();
        if (res) {
          this.toasterService.success("Your settings are saved successfully!");
          Utils.hideSpinner();
        }
      }, error => {
        this.toasterService.error("Your settings are not saved successfully!");
      })
    }
    else {
      this.onDemandService.editSaveSettings(saveSettingsrequestBody).subscribe(res => {
        Utils.showSpinner();
        if (res) {
          this.toasterService.success("Your settings are saved successfully!");
          Utils.hideSpinner();
        }
      }, error => {
        this.toasterService.error("Your settings are not saved successfully!");
      })
    }
  }

}