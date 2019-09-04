import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PivotTableWrapperComponent } from './pivot-table-wrapper.component';

describe('PivotTableWrapperComponent', () => {
  let component: PivotTableWrapperComponent;
  let fixture: ComponentFixture<PivotTableWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PivotTableWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PivotTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
