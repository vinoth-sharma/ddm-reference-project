import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageParametersComponent } from './manage-parameters.component';

describe('ManageParametersComponent', () => {
  let component: ManageParametersComponent;
  let fixture: ComponentFixture<ManageParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
