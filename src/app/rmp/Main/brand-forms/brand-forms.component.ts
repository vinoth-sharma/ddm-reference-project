import { Component, OnInit } from '@angular/core';

import { DjangoService } from 'src/app/rmp/django.service';
import { BrandFormsService } from './brand-forms.service'
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
  public isHomePage: boolean = true;
  public editDataRecord: any = {};

  constructor(private django: DjangoService,
    private brandFormsService: BrandFormsService,
    private toasterService: NgToasterComponent) {
  }

  ngOnInit() {
    this.isHomePage = true;
    this.editDataRecord = {};
  }

  public getReportList(msgFlag?: boolean) {
    if (this.isHomePage) {
      this.isHomePage = !this.isHomePage;
    }
    Utils.showSpinner();
    this.brandFormsService.getBrandFormsData().subscribe(result => {
      console.log("INCOMING GTRD results : ", result);
      this.reports = result['data'];
      this.reports.forEach(element => {
        if (element['BRAND']) {
          element['clicked'] = false;
        }
      });

      if (msgFlag) {
        this.toasterService.success('Data updated successfully!');
      }
      //sort and display if needed
      console.log('Checking REPORTS DATA:', this.reports)
      Utils.hideSpinner();
    })
  }


  public toggleShowInput(element) {
    console.log('element details', element)
    if (element != undefined) {
      this.editDataRecord['brand_value_old'] = element['BRAND']
      this.editDataRecord['alloc_grp_cd_val_old'] = element['ALLOC_GRP_CD']
    }

    let i = 0;
    for (i = 0; i <= this.reports.length; i++) {
      if (this.reports[i]['BRAND'] == element['BRAND'] && this.reports[i]['ALLOC_GRP_CD'] == element['ALLOC_GRP_CD']) {
        this.reports[i]['clicked'] = true;
      } else {
        this.reports[i]['clicked'] = false;
      }
    }
    console.log('Checking REPORTS DATA after clicking:', this.reports)
  }

  // updating the data record
  public changeReportName(newRecordDataObject: any) {
    Utils.showSpinner();

    this.editDataRecord['brand_value_new'] = newRecordDataObject['BRAND'];
    this.editDataRecord['alloc_grp_cd_val_new'] = newRecordDataObject['ALLOC_GRP_CD'];
    console.log("NEW OBJ to be pushed : ", this.editDataRecord);

    this.brandFormsService.updateBrandFormsDataRecord(this.editDataRecord).subscribe(res => {
      if (res) {
        this.getReportList(true);
        this.editDataRecord = {};
      }
    },
      err => {
        this.toasterService.error('Data updated failed!');
        Utils.hideSpinner();
      })
  }

  // DO NOT DELETE : Used for future implementation 
  public deleteRecord(element: any) {
    Utils.showSpinner();
    let deleteRecord = {}
    deleteRecord['brand_value'] = element['BRAND'];
    deleteRecord['alloc_grp_cd_val'] = element['ALLOC_GRP_CD'];

    this.brandFormsService.deleteBrandFormsDataRecord(deleteRecord).subscribe(res => {
      if (res) {
        this.toasterService.success('Data deleted successfully!');
        Utils.hideSpinner();
      }
    }, err => {
      this.toasterService.success('Data deleted failed!');
      Utils.hideSpinner();
    })
  }

  // passing filters into obj
  public filterData() {
    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }

}
