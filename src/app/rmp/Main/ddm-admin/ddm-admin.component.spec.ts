import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdmAdminComponent } from './ddm-admin.component';

describe('DdmAdminComponent', () => {
  let component: DdmAdminComponent;
  let fixture: ComponentFixture<DdmAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdmAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdmAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
