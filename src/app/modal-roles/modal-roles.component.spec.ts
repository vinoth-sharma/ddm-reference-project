import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRolesComponent } from './modal-roles.component';

describe('ModalRolesComponent', () => {
  let component: ModalRolesComponent;
  let fixture: ComponentFixture<ModalRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
