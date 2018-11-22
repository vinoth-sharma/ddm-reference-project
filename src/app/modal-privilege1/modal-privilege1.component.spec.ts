import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrivilege1Component } from './modal-privilege1.component';

describe('ModalPrivilege1Component', () => {
  let component: ModalPrivilege1Component;
  let fixture: ComponentFixture<ModalPrivilege1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPrivilege1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrivilege1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
