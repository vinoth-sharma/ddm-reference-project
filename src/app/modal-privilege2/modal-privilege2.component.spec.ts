import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrivilege2Component } from './modal-privilege2.component';

describe('ModalPrivilege2Component', () => {
  let component: ModalPrivilege2Component;
  let fixture: ComponentFixture<ModalPrivilege2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPrivilege2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrivilege2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
