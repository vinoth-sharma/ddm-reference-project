import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetailsComponent } from './request-details.component';

describe('RequestDetailsComponent', () => {
  let component: RequestDetailsComponent;
  let fixture: ComponentFixture<RequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check values of request-details component IF NO VALUES',() => {
    fixture = TestBed.createComponent(RequestDetailsComponent);
    component = fixture.componentInstance;
    let tempObject;
    fixture.detectChanges(); 
    expect(component.details).toEqual({});
  })

  it('should check values of request-details component IF IT HAS VALUES',() => {
    fixture = TestBed.createComponent(RequestDetailsComponent);
    component = fixture.componentInstance;
    let tempObject;
    fixture.detectChanges(); 
    expect(component.details).not.toEqual({});
  })

});
