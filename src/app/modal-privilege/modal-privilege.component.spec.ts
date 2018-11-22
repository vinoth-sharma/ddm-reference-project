import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrivilegeComponent } from './modal-privilege.component';

describe('ModalPrivilegeComponent', () => {
  let component: ModalPrivilegeComponent;
  let fixture: ComponentFixture<ModalPrivilegeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPrivilegeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
