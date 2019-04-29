import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestOnBehalfComponent } from './request-on-behalf.component';

describe('RequestOnBehalfComponent', () => {
  let component: RequestOnBehalfComponent;
  let fixture: ComponentFixture<RequestOnBehalfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestOnBehalfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestOnBehalfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
