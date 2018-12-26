import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegeModalComponent } from './privilege-modal.component';

describe('PrivilegeModalComponent', () => {
  let component: PrivilegeModalComponent;
  let fixture: ComponentFixture<PrivilegeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivilegeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
