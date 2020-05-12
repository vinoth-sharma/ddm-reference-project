import { Component, OnInit } from '@angular/core';

import { DjangoService } from 'src/app/rmp/django.service';
import Utils from 'src/utils';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

@Component({
  selector: 'app-brand-forms',
  templateUrl: './brand-forms.component.html',
  styleUrls: ['./brand-forms.component.css']
})
export class BrandFormsComponent implements OnInit {

  public reports: any = []
  public searchObj: any = [];
  public filters = {
    report_name: '',
  };
  public param: any;
  public orderType: any;
  public backupObject: any = {};
  public isHomePage: boolean = true;

  constructor(private django: DjangoService,
    private toasterService: NgToasterComponent) {
  }

  ngOnInit() {
    this.getReportList();
    this.isHomePage = true;
  }

  // v1
  // public getReportList(msgFlag? :boolean) {
  //   Utils.showSpinner();
  //   this.django.get_report_list().subscribe(list => {
  //     if (list) {
  //       let reportContainer = list['data'];
  //       console.log("input data : ",reportContainer);

  //       // reportContainer = reportContainer.filter(i=>i.report_name)
  //       reportContainer.filter(i=>{ if(i.report_name == null) { i.report_name = 'null'}})
  //       console.log("filtered data : ",reportContainer);

  //       reportContainer.sort((a, b) => {
  //         if (b['favorites'] == a['favorites']) {
  //           return a['report_name'] > b['report_name'] ? 1 : -1
  //         }
  //         return b['favorites'] > a['favorites'] ? 1 : -1
  //       })

  //       this.reports = reportContainer;
  //       // this.paginatorlength = this.reports.length
  //       // this.reportsOriginal = this.reportContainer.slice();
  //       if(msgFlag){
  //         this.toasterService.success('Data updated successfully!');
  //       }
  //       Utils.hideSpinner();
  //     }
  //   }, err => {
  //   })
  // }

  public getReportList(msgFlag?: boolean) {
    Utils.showSpinner();

    let results = require('./bfac.json')
    console.log('RESULTS are : ', results);
    results = results['data'][0];
    console.log('results[data][0] : ', results);
    let brands = results['brand']
    console.log('brands : ', brands);
    let alloc_grp_cd = results['alloc_grp_cd']
    console.log('alloc_grp_cd : ', alloc_grp_cd);

    this.reports = [];
    for (var i = 0; i < brands.length; i++) {
      let newObj = {}
      newObj['brand'] = brands[i];
      newObj['alloc_grp_cd'] = alloc_grp_cd[i];
      this.reports[i] = newObj
    }

    console.log("NEW JSON OBJ : ", this.reports);

    Utils.hideSpinner();
  }


  public toggleShowInput(element, type: string) {
    console.log('element details', element)
    this.backupObject = element;
    console.log('backupObject details', this.backupObject)
    console.log('element details', type)

    if (type == 'brand') {
      for (let i = 0; i <= this.reports.length; i++) {
        if (this.reports[i]['brand'] != element.brand) {
          this.reports[i]['clicked'] = false;
        } else {
          this.reports[i]['clicked'] = !this.reports[i]['clicked'];
          break;
        }
      }
    }
    else {
      for (let i = 0; i <= this.reports.length; i++) {
        if (this.reports[i]['alloc_grp_cd'] != element.alloc_grp_cd) {
          this.reports[i]['clicked'] = false;
        } else {
          this.reports[i]['clicked'] = !this.reports[i]['clicked'];
          break;
        }
      }
    }
  }

  public changeReportName(event: any, reportObject: any) {
    const changedReport = {};
    Utils.showSpinner();
    changedReport['brand'] = reportObject.brand;
    changedReport['alloc_grp_cd'] = reportObject.alloc_grp_cd;
    console.log("NEW OBJ to be pushed : ", changedReport);

    let bbrand = this.backupObject['brand']
    let bagc = this.backupObject['alloc_grp_cd']
    //old object delete
    this.reports = this.reports.filter(function (obj) {
      return (obj.brand !== bbrand && obj.alloc_grp_cd !== bagc);
    });
    console.log("Deleted reports : ", this.reports);
    console.log("DELETED REPORTS LENGTH : ", this.reports.length)

    this.reports.push(changedReport)

    console.log("EDITED reports : ", this.reports);
    console.log("EDITED REPORTS LENGTH : ", this.reports.length)

    //sort and display
    this.toasterService.success('Data updated successfully!');
    Utils.hideSpinner();
  }

  public deleteRecord(element: any) {
    // NOTE that unique deletion has to be done,BE api will handle it
    const deleteRecord = {}
    deleteRecord['brand'] = element.brand;
    deleteRecord['alloc_grp_cd'] = element.alloc_grp_cd;

    let dbrand = this.backupObject['brand']
    let dagc = this.backupObject['alloc_grp_cd']

    this.reports = this.reports.filter(function (obj) {
      return (obj.brand !== dbrand && obj.alloc_grp_cd !== dagc);
    });

    this.toasterService.success('Data deleted successfully!');

  }

  // parsing filters into obj
  public filterData() {
    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }

  public sort(typeVal) {
    this.param = typeVal;
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
  }

}
