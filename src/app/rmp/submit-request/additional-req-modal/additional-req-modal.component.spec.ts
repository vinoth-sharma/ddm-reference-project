import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalReqModalComponent } from './additional-req-modal.component';

describe('AdditionalReqModalComponent', () => {
  let component: AdditionalReqModalComponent;
  let fixture: ComponentFixture<AdditionalReqModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalReqModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalReqModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
