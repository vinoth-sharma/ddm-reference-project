import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveReportComponent } from './save-report.component';

describe('SaveReportComponent', () => {
  let component: SaveReportComponent;
  let fixture: ComponentFixture<SaveReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call the getSemanticName()',()=>{
  //   fixture = TestBed.createComponent(SaveReportComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();

  // })

  it('should check the after reset() values',()=>{
    fixture = TestBed.createComponent(SaveReportComponent);
    component = fixture.componentInstance;
    component.reset();
    fixture.detectChanges();

    expect(this.fruits).toEqual([])
    expect(this.fruitCtrl).toEqual('')
    expect(this.userIds).toEqual([])
    // this.fruits = [];
    // this.fruitCtrl.setValue('');
    // Utils.closeModals();
    // this.userIds = [];

  })

  it('should check working of UpdateData()', () => {
    fixture = TestBed.createComponent(SaveReportComponent);
    component = fixture.componentInstance;
    component.updateData();

    expect(component.selectedReportId['report_list_id']).toEqual(this.selectedReportId)
    expect(component.selectedReportId['user_id']).toEqual(this.userIdsCopy)
  })

});
