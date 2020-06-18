import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import Utils from 'src/utils';
import { Router } from '@angular/router';
import { SubmitRequestService } from '../submit-request.service';
import { DjangoService } from '../../django.service';
declare var jsPDF: any;
declare var $: any;

@Component({
  selector: 'app-review-req-modal',
  templateUrl: './review-req-modal.component.html',
  styleUrls: ['./review-req-modal.component.css']
})
export class ReviewReqModalComponent implements OnInit {
  public reqDate: string = '11-May-2020';
  public reqNumber: Number = 3671;
  public repTitle: string = 'New Report';
  public marketData = [];
  public otherReportCriteria = {
    freq: "",
    textNotification: "",
    spclIdentifiers: [],
    frequency_data: []
  };
  public reqDetails = {
    reqId: null,
    reqDate: null,
    title: "",
    addReq: "",
    type: "",
    business_req: ""
  }
  public vehicleEvent = {
    orderCriteria: [],
    orderMetrics: [],
    dosp_start: null,
    dosp_end: null,
    keyData_start: null,
    keyData_end: null
  }
  public dealerAlloc = {
    consensusProcess: []
  };
  public l_masterData: any;

  constructor(public dialogRef: MatDialogRef<ReviewReqModalComponent>,
    private toaster: NgToasterComponent,
    public dialog: MatDialog,
    public django: DjangoService,
    private router: Router,
    public submitService: SubmitRequestService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.l_masterData = JSON.parse(JSON.stringify(this.data));
    this.generateRequestData(this.data);
    this.generateMarketData(this.data.selectedReqData);
    if (this.data.reqBody.report_detail.report_type === "ots") {
      this.generateVehicleEvent(this.data.reqBody)
    }
    else
      this.generateDealerAllocation(this.data.reqBody)
  }

  submitRequest() {
    if (this.reqDetails.type === "ots")
      this.saveVehicleEventStatus();
    else
      this.saveDealerAllocation();
  }

  //to save vehicle event status for selected request
  saveVehicleEventStatus() {
    Utils.showSpinner();
    this.submitService.submitVehicelEventStatus(this.l_masterData.reqBody).subscribe(response => {
      this.submitFile();
      this.submitService.setSubmitOnBehalf("", "");
      this.closeDailog();
      Utils.hideSpinner();
      this.toaster.success(`Request #${this.l_masterData.reqBody.report_id} Updated successfully`);
      this.router.navigate(["user/request-status"]);
    }, err => {
      Utils.hideSpinner();
    });
  }

  //to save dealer allocation for selected request
  saveDealerAllocation() {
    Utils.showSpinner();
    this.submitService.submitDealerAllocation(this.l_masterData.reqBody).subscribe(response => {
      this.submitFile();
      this.submitService.setSubmitOnBehalf("", "");
      this.closeDailog();
      Utils.hideSpinner();
      this.toaster.success(`Request #${this.l_masterData.reqBody.report_id} Updated successfully`);
      this.router.navigate(["user/request-status"]);
    }, err => {
      Utils.hideSpinner();
    });
  }

  submitFile() {
    if (this.data.selectedFile)
      this.django.ddm_rmp_file_data(this.data.selectedFile).subscribe(response => {
      }, err => {
      });
  }

  generateRequestData(data) {
    this.reqDetails.reqId = data.reqBody.report_id;
    this.reqDetails.reqDate = data.reqBody.report_detail.created_on;
    this.reqDetails.title = data.reqBody.report_detail.title;
    this.reqDetails.addReq = data.reqBody.report_detail.additional_req;
    this.reqDetails.type = data.reqBody.report_detail.report_type;
    this.reqDetails.business_req = data.reqBody.report_detail.business_req;
  }

  generateVehicleEvent(data) {
    if (data.allocation_group.dropdown.length) {
      let obj = {
        label: "Allocation Group(s) selection:",
        data: data.allocation_group.dropdown.map(ele => ele.allocation_group)
      }
      this.vehicleEvent.orderCriteria.push(obj);
    }

    if (data.model_year.dropdown.length) {
      let obj = {
        label: "Model(s) selection:",
        data: data.model_year.dropdown.map(ele => ele.model_year)
      }
      this.vehicleEvent.orderCriteria.push(obj);
    }

    if (data.vehicle_line.dropdown.length) {
      let obj = {
        label: "Vehicle Line Brand(s) selection:",
        data: data.vehicle_line.dropdown.map(ele => ele.vehicle_line_brand)
      }
      this.vehicleEvent.orderCriteria.push(obj);
    }

    if (data.merchandizing_model.dropdown.length) {
      let obj = {
        label: "Merchandizing Model(s) selection:",
        data: data.merchandizing_model.dropdown.map(ele => ele.merchandising_model)
      }
      this.vehicleEvent.orderCriteria.push(obj);
    }

    if (data.distribution_data.length) {
      let obj = {
        label: "Distribution Entity(s) selection:",
        data: data.distribution_data.map(ele => ele.value)
      }
      this.vehicleEvent.orderCriteria.push(obj);
    }

    if (data.order_event.dropdown.length) {
      let obj = {
        label: "Order Event(s) selection:",
        data: data.order_event.dropdown.map(ele => {
          if (ele.ddm_rmp_lookup_dropdown_order_event_id === 0)
            return `Others - ${ele.order_event}`
          else
            return ele.order_event
        })
      }
      this.vehicleEvent.orderCriteria.push(obj);
    }

    if (data.order_type.dropdown.length) {
      let obj = {
        label: "Order Type(s) selection:",
        data: data.order_type.dropdown.map(ele => ele.order_type)
      }
      this.vehicleEvent.orderCriteria.push(obj);
    }

    if (data.checkbox_data.length) {
      let obj = { label: "Order Metric(s) Selected:", data: [] }
      obj.data = data.checkbox_data.map(ele => {
        if (ele.desc)
          return `${ele.value} - ${ele.desc}`
        else
          return ele.value
      })

      this.vehicleEvent.orderMetrics.push(obj)
    }

    if (data.dosp_start_date) {
      this.vehicleEvent.dosp_start = new Date(data.dosp_start_date);
      this.vehicleEvent.dosp_end = new Date(data.dosp_end_date);
    }
    if (data.data_date_range.StartDate) {
      this.vehicleEvent.keyData_start = new Date(data.data_date_range.StartDate);
      this.vehicleEvent.keyData_end = new Date(data.data_date_range.EndDate);
    }

  }

  generateDealerAllocation(data) {
    if (data.allocation_group.dropdown.length) {
      let obj = {
        label: "Allocation group(s) selection:",
        data: data.allocation_group.dropdown.map(ele => ele.allocation_group)
      }
      this.dealerAlloc.consensusProcess.push(obj);
    }
    if (data.model_year.dropdown.length) {
      let obj = {
        label: "Model year(s) selection:",
        data: data.model_year.dropdown.map(ele => ele.model_year)
      }
      this.dealerAlloc.consensusProcess.push(obj);
    }
    if (data.concensus_data.length) {
      let obj = {
        label: "Consensus data(s) selection:",
        data: data.concensus_data.map(ele => ele.value)
      }
      this.dealerAlloc.consensusProcess.push(obj);
    }

    let l_obj = data.concensus_time_date;
    let obj1 = {
      label: "Consensus start date:",
      data: `${l_obj.startM} - ${l_obj.startY} (${l_obj.startCycle})`
    }
    this.dealerAlloc.consensusProcess.push(obj1);
    let obj2 = {
      label: "Consensus end date:",
      data: `${l_obj.endM} - ${l_obj.endY} (${l_obj.endCycle})`
    }
    this.dealerAlloc.consensusProcess.push(obj2);

  }

  generateMarketData(data) {

    if (data.market_data.length) {
      let obj = {
        label: "Market(s) selection:",
        data: data.market_data.map(ele => ele.market)
      }
      this.marketData.push(obj)
    }
    if (data.division_dropdown.length) {
      let obj = {
        label: "Division(s) selection:",
        data: data.division_dropdown.map(ele => ele.division_desc)
      }
      this.marketData.push(obj)
    }
    if (data.country_region_data.length) {
      let obj = {
        label: "Region(s) selection:",
        data: data.country_region_data.map(ele => ele.region_desc)
      }
      this.marketData.push(obj)
    }
    if (data.region_zone_data.length) {
      let obj = {
        label: "Zone(s) selection:",
        data: data.region_zone_data.map(ele => ele.zone_desc)
      }
      this.marketData.push(obj)
    }
    if (data.zone_area_data.length) {
      let obj = {
        label: "Area(s) selection:",
        data: data.zone_area_data.map(ele => ele.area_desc)
      }
      this.marketData.push(obj)
    }
    if (data.lma_data.length) {
      let obj = {
        label: "LMA(s) selection:",
        data: data.lma_data.map(ele => ele.lmg_desc)
      }
      this.marketData.push(obj)
    }
    if (data.gmma_data.length) {
      let obj = {
        label: "GMMA(s) selection:",
        data: data.gmma_data.map(ele => ele.gmma_desc)
      }
      this.marketData.push(obj)
    }
    if (data.bac_data[0].bac_desc.length) {
      let obj = {
        label: "BAC(s) selection:",
        data: data.bac_data[0].bac_desc
      }
      this.marketData.push(obj)
    }
    if (data.fan_data[0].fan_data.length) {
      let obj = {
        label: "FAN(s) selection:",
        data: data.fan_data[0].fan_data
      }
      this.marketData.push(obj)
    }

    if (data['dl_list'].length) {
      let list = [];
      data['dl_list'].map(element => {
        list.push(element['distribution_list'])
      })
      let obj = {
        label: "Emails::",
        data: list
      }
      this.marketData.push(obj);
    }


    if (data.frequency_data.length) {
      if (data.frequency_data.length === 1) {
        if (data.frequency_data[0].ddm_rmp_lookup_select_frequency_id === 39)
          this.otherReportCriteria.freq = "One Time"
        else
          this.otherReportCriteria.freq = "Recurring"
      }
      else {
        this.otherReportCriteria.freq = "Recurring"
      }

      this.otherReportCriteria.frequency_data = data.frequency_data.map(ele => {
        return {
          label: ele.select_frequency_values,
          data: "Yes"
        }
      })
    }

    if (data.special_identifier_data.length) {
      this.otherReportCriteria.spclIdentifiers = data.special_identifier_data.map(ele => {
        return {
          label: ele.spl_desc,
          data: "Yes"
        }
      })
    }

    this.otherReportCriteria.textNotification = data.user_data[0].alternate_number ? "Yes" : "No";
  }

  downloadSummary() {
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
      function () { doc.save(`summary-request.pdf`); }, margins
    );
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

}
