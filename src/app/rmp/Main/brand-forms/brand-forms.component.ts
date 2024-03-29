import { Component, OnInit } from '@angular/core';

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
  public param: any;
  public orderType: any;
  public isHomePage: boolean = true;
  public isDataLoaded: boolean = false;
  public editDataRecord: any = {};
  public newBrandName: string = '';
  public reportDataColumns = {
    immutable: '',
    mutable: ''
  }
  public brandFormName: string = '';
  public filters: any = {}
  public statusFilter: any = [];
  public deleteRecordData: any = {};

  constructor(private brandFormsService: BrandFormsService,
    private toasterService: NgToasterComponent) {
  }

  ngOnInit() {
    this.isHomePage = true;
    this.editDataRecord = {};
  }

  // obtaining the brand-form-data
  public getBrandFormList(msgFlag?: string) {
    if (this.isHomePage) {
      this.isHomePage = !this.isHomePage;
    }
    Utils.showSpinner();
    this.brandFormsService.getBrandFormsData().subscribe(result => {
      if (result) {
        this.brandFormName = result['table_name']
        this.reportDataColumns['mutable'] = result['col_names'][0]
        this.reportDataColumns['immutable'] = result['col_names'][1]
        this.reports = result['data'];
        this.reports.forEach(element => {
          if (element[this.reportDataColumns['immutable']]) {
            element['clicked'] = false;
          }
        });

        if (msgFlag == 'update') {
          this.toasterService.success('Data record updated successfully!');
        }
        else if (msgFlag == 'delete') {
          this.toasterService.success('Data record deleted successfully!');
        }

        let nullBrands = this.reports.filter(i => { return (i[this.reportDataColumns['mutable']] == null) })
        let nonNullBrands = this.reports.filter(i => { return (i[this.reportDataColumns['mutable']] != null) })
        nonNullBrands.sort((a, b) => (a[this.reportDataColumns['mutable']] > b[this.reportDataColumns['mutable']]) ? 1 : ((b[this.reportDataColumns['mutable']] > a[this.reportDataColumns['mutable']]) ? -1 : 0));
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

  // toggling the divs and capturing backup/original values
  public toggleShowInput(element) {
    let skipClickCalculation = false;
    if (element == "element") {
      let newBrandValueProcured = (<HTMLInputElement>document.getElementById('editedField')).value
      this.reports.map(i => {
        if (i[this.reportDataColumns['mutable']] == newBrandValueProcured && i[this.reportDataColumns['immutable']] == this.editDataRecord['alloc_grp_cd_val_old']) {
          i['clicked'] = false;
          skipClickCalculation = true;
        }
      })
      this.newBrandName = '';
    }
    else {
      this.editDataRecord['brand_value_old'] = element[this.reportDataColumns['mutable']];
      this.editDataRecord['alloc_grp_cd_val_old'] = element[this.reportDataColumns['immutable']];
      this.newBrandName = element[this.reportDataColumns['mutable']];
    }

    if (!skipClickCalculation) {
      var i = 0;
      for (i = 0; i <= this.reports.length; i++) {
        if (this.reports[i][this.reportDataColumns['mutable']] == element[this.reportDataColumns['mutable']] && this.reports[i][this.reportDataColumns['immutable']] == element[this.reportDataColumns['immutable']]) {
          this.reports[i]['clicked'] = true;
        } else {
          this.reports[i]['clicked'] = false;
        }
      }
    }
  }

  // updating the data record
  public changeBrandName(newRecordDataObject: any) {
    Utils.showSpinner();
    this.editDataRecord['brand_value_new'] = newRecordDataObject;
    this.editDataRecord['alloc_grp_cd_val_new'] = this.editDataRecord['alloc_grp_cd_val_old'];
    if (this.editDataRecord['brand_value_new'].length == 0) {
      this.editDataRecord['brand_value_new'] = null;
    }
    if (this.editDataRecord['brand_value_new'] != this.editDataRecord['brand_value_old']) {
      this.brandFormsService.updateBrandFormsDataRecord(this.editDataRecord).subscribe(res => {
        if (res) {
          this.getBrandFormList('update');
          this.editDataRecord = {};
        }
      }, err => {
        this.toasterService.error('Data updated failed!');
        Utils.hideSpinner();
      })
    }
    else {
      this.toasterService.error('Please enter a new/different name!');
      Utils.hideSpinner();
    }
  }

  // ask for confirmation of modal
  public confirmDeletion() {
    Utils.showSpinner();
    this.brandFormsService.deleteBrandFormsDataRecord(this.deleteRecordData).subscribe(res => {
      if (res) {
        this.toasterService.success('Data deleted successfully!');
        this.getBrandFormList('delete');
      }
    }, err => {
      this.toasterService.error('Data deletion failed!');
      Utils.hideSpinner();
    })
  }

  //capturing the details of the record to be deleted
  public deleteRecordCapture(element: any) {
    this.deleteRecordData = {}
    this.deleteRecordData['brand_value'] = element[this.reportDataColumns['mutable']];
    this.deleteRecordData['alloc_grp_cd_val'] = element[this.reportDataColumns['immutable']];
    if (this.deleteRecordData['brand_value'] == '' && this.deleteRecordData['brand_value'].length == 0) {
      delete this.deleteRecordData['brand_value'];
    }
  }

  // passing filters into obj
  public filterData() {
    this.searchObj = JSON.parse(JSON.stringify(this.filters));
  }

  // sorting the columns
  public sort(typeVal) {
    this.param = typeVal;
    if (typeVal == this.reportDataColumns['mutable']) {
      if (this.reports[this.reportDataColumns['immutable']]) {
        delete this.reports[this.reportDataColumns['immutable']]
      }
    }
    else if (typeVal == this.reportDataColumns['immutable']) {
      if (this.reports[this.reportDataColumns['mutable']]) {
        delete this.reports[this.reportDataColumns['mutable']]
      }
    }
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
  }

}