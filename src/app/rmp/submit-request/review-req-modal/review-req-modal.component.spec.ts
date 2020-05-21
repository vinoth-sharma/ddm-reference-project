import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewReqModalComponent } from './review-req-modal.component';

describe('ReviewReqModalComponent', () => {
  let component: ReviewReqModalComponent;
  let fixture: ComponentFixture<ReviewReqModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewReqModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewReqModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
