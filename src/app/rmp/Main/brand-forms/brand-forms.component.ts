import { Component, OnInit } from '@angular/core';

import { DjangoService } from 'src/app/rmp/django.service';
import { BrandFormsService } from './brand-forms.service'
import Utils from 'src/utils';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

//Angular Component developed by Deepak Urs G V
@Component({
  selector: 'app-brand-forms',
  templateUrl: './brand-forms.component.html',
  styleUrls: ['./brand-forms.component.css']
})
export class BrandFormsComponent implements OnInit {

  public reports: any = []
  public searchObj: any = [];
  public filters = {
    BRAND: '',
    ALLOC_GRP_CD: ''
  };
  public param: any;
  public orderType: any;
  public isHomePage: boolean = true;
  public isDataLoaded: boolean = false;
  public editDataRecord: any = {};
  public newBrandName: string = '';

  constructor(private django: DjangoService,
    private brandFormsService: BrandFormsService,
    private toasterService: NgToasterComponent) {
  }

  ngOnInit() {
    this.isHomePage = true;
    this.editDataRecord = {};
  }

  public getBrandFormList(msgFlag?: boolean) {
    if (this.isHomePage) {
      this.isHomePage = !this.isHomePage;
    }
    Utils.showSpinner();
    this.brandFormsService.getBrandFormsData().subscribe(result => {
      if (result) {
        console.log("INCOMING GTRD results : ", result);
        this.reports = result['data'];
        this.reports.forEach(element => {
          if (element['ALLOC_GRP_CD']) {
            element['clicked'] = false;
          }
        });

        if (msgFlag) {
          this.toasterService.success('Data updated successfully!');
        }
        console.log('Checking REPORTS DATA:', this.reports)
        let nullBrands = this.reports.filter(i => { return (i['BRAND'] == null) })
        let nonNullBrands = this.reports.filter(i => { return (i['BRAND'] != null) })
        nonNullBrands.sort((a, b) => (a['BRAND'] > b['BRAND']) ? 1 : ((b['BRAND'] > a['BRAND']) ? -1 : 0));
        Array.prototype.push.apply(nullBrands, nonNullBrands);
        this.reports = nullBrands;
        this.isDataLoaded = true;
        Utils.hideSpinner();
      }
    }, error => {
      this.isDataLoaded = false;
      this.toasterService.error("Data loading failed! Please try again or contact Admin!");
      Utils.hideSpinner();
    })
  }


  public toggleShowInput(element) {
    console.log('element details', element);
    console.log('element data type', typeof (element));
    let skipClickCalculation = false;

    if (element == "element") {
      let newBrandValueProcured = (<HTMLInputElement>document.getElementById('editedField')).value
      this.reports.map(i => {
        if (i['BRAND'] == newBrandValueProcured && i['ALLOC_GRP_CD'] == this.editDataRecord['alloc_grp_cd_val_old']) {
          i['clicked'] = false;
          skipClickCalculation = true;
        }
      })
      this.newBrandName = '';
    }
    else {
      this.editDataRecord['brand_value_old'] = element['BRAND'];
      this.editDataRecord['alloc_grp_cd_val_old'] = element['ALLOC_GRP_CD'];
      this.newBrandName = element['BRAND'];
    }

    if (!skipClickCalculation) {
      var i = 0;
      for (i = 0; i <= this.reports.length; i++) {
        if (this.reports[i]['BRAND'] == element['BRAND'] && this.reports[i]['ALLOC_GRP_CD'] == element['ALLOC_GRP_CD']) {
          this.reports[i]['clicked'] = true;
        } else {
          this.reports[i]['clicked'] = false;
        }
      }
    }
    console.log('Checking REPORTS DATA after clicking:', this.reports)
  }

  // updating the data record
  public changeReportName(newRecordDataObject: any) {
    Utils.showSpinner();

    this.editDataRecord['brand_value_new'] = newRecordDataObject;
    this.editDataRecord['alloc_grp_cd_val_new'] = this.editDataRecord['alloc_grp_cd_val_old'];
    console.log("NEW OBJ to be pushed : ", this.editDataRecord);

    if (this.editDataRecord['brand_value_new'].length == 0) {
      this.editDataRecord['brand_value_new'] = null;
    }

    if (this.editDataRecord['brand_value_new'] != this.editDataRecord['brand_value_old']) {
      this.brandFormsService.updateBrandFormsDataRecord(this.editDataRecord).subscribe(res => {
        if (res) {
          this.getBrandFormList(true);
          this.editDataRecord = {};
        }
      },
        err => {
          this.toasterService.error('Data updated failed!');
          Utils.hideSpinner();
        })
    }
    else {
      this.toasterService.error('Please enter a new/different name!');
      Utils.hideSpinner();
    }
  }

  // DO NOT DELETE : Used for future implementation 
  public deleteRecord(element: any) {
    Utils.showSpinner();
    let deleteRecord = {}
    deleteRecord['brand_value'] = element['BRAND'];
    deleteRecord['alloc_grp_cd_val'] = element['ALLOC_GRP_CD'];
    if (deleteRecord['brand_value'] == '' && deleteRecord['brand_value'].length == 0) {
      delete deleteRecord['brand_value'];
    }

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

  public sort(typeVal) {
    this.param = typeVal;
    if (typeVal == 'BRAND') {
      if (this.reports['ALLOC_GRP_CD']) {
        delete this.reports['ALLOC_GRP_CD']
      }
      this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
      this.orderType = this.reports[typeVal];
    }
    else if (typeVal == 'ALLOC_GRP_CD') {
      if (this.reports['BRAND']) {
        delete this.reports['BRAND']
      }
      this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
      this.orderType = this.reports[typeVal];
    }
  }

}