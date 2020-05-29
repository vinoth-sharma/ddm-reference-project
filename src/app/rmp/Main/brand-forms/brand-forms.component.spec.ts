import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../../../material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrandFormsComponent } from './brand-forms.component';
import { BrandFormsService } from './brand-forms.service'
import Utils from 'src/utils';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { OrderByPipe } from "../../../custom-directives/filters/order-by.pipe";
import { FilterTablePipe } from '../../filter-table.pipe';

describe('BrandFormsComponent', () => {
  let component: BrandFormsComponent;
  let fixture: ComponentFixture<BrandFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrandFormsComponent, OrderByPipe, FilterTablePipe, NgToasterComponent],
      imports: [MaterialModule, FormsModule, HttpClientModule, ReactiveFormsModule, BrowserAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test ngOnInit()', () => {
    component.ngOnInit();
    expect(component.isHomePage).toEqual(true);
    expect(component.editDataRecord).toEqual({})
  })

  it('should test the changeBrandName method', () => {
    spyOn(Utils, 'showSpinner')
    spyOn(Utils, 'hideSpinner')
    let testNewRecordDataObject = 'newRecordData'
    component.editDataRecord['alloc_grp_cd_val_old'] = 'testAGCVO'
    component.changeBrandName(testNewRecordDataObject);
    expect(Utils.showSpinner).toHaveBeenCalled()
    expect(component.editDataRecord['brand_value_new']).toEqual(testNewRecordDataObject)
    expect(component.editDataRecord['alloc_grp_cd_val_new']).toEqual(component.editDataRecord['alloc_grp_cd_val_old'])
  })

  it('should test toggleShowInput()', () => {
    let testElement = { mutable: 'testMutable', immutable: 'testImmutable' }
    component.reports = { mutable: 'testMutable', immutable: 'testImmutable' }
    component.reportDataColumns = { mutable: '', immutable: '' }
    component.editDataRecord = {
      brand_value_new: 'testbrand_value_new',
      brand_value_old: 'testbrand_value_old',
      alloc_grp_cd_val_old: 'testalloc_grp_cd_val_old',
      alloc_grp_cd_val_new: 'testalloc_grp_cd_val_new'
    }
    component.toggleShowInput(testElement);

    expect(component.editDataRecord['brand_value_old']).toEqual(testElement[component.reportDataColumns['mutable']])
    expect(component.editDataRecord['alloc_grp_cd_val_old']).toEqual(testElement[component.reportDataColumns['immutable']])
    expect(component.newBrandName).toEqual(testElement[component.reportDataColumns['mutable']])
  })

  it('should test the sort()', () => {
    let testTypeValue = 'testValue';
    component.reportDataColumns = { mutable: 'testValue', immutable: '' }
    component.reports = { mutable: 'testMutable', immutable: 'testImmutable' }

    component.sort(testTypeValue);

    expect(component.reports[testTypeValue]).toEqual('reverse');
    expect(component.orderType).toEqual(component.reports[testTypeValue])

    //second case
    let testTypeValueAlternative = 'testValue';
    component.reportDataColumns = { mutable: '', immutable: 'testValue' }
    component.reports = { mutable: 'testMutable', immutable: 'testImmutable' }

    component.sort(testTypeValueAlternative);

    expect(component.reports[testTypeValue]).toEqual('reverse');
    expect(component.orderType).toEqual(component.reports[testTypeValue])
  })

  it('should test the filterData()', () => {
    component.filters = {}

    component.filterData();

    expect(component.searchObj).toEqual(JSON.parse(JSON.stringify(component.filters)))
  })

  it('should test the getBrandFormList API call and respective variables', () => {
    let testBrandFormsService = TestBed.inject(BrandFormsService);
    let testDataResult = { key: 'key', value: 'value' }
    spyOn(Utils, 'hideSpinner');

    testBrandFormsService.getBrandFormsData().subscribe(res => {
      expect(res).toEqual(testDataResult)
      expect(component.brandFormName).toEqual(res['table_name']);
      expect(component.reportDataColumns['mutable']).toEqual(res['col_names'][0])
      expect(component.reportDataColumns['immutable']).toEqual(res['col_names'][1])
      expect(component.reports).toEqual(res['data'])
      expect(component.isDataLoaded).toEqual(true)
      expect(Utils.hideSpinner).toHaveBeenCalled();
    })

  })

});
