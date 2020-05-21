import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestOnbehalfComponent } from './request-onbehalf.component';

describe('RequestOnbehalfComponent', () => {
  let component: RequestOnbehalfComponent;
  let fixture: ComponentFixture<RequestOnbehalfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestOnbehalfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestOnbehalfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
