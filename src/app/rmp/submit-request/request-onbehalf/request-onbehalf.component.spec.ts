import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestOnbehalfComp } from './request-onbehalf.component';

describe('RequestOnbehalfComp', () => {
  let component: RequestOnbehalfComp;
  let fixture: ComponentFixture<RequestOnbehalfComp>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestOnbehalfComp ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestOnbehalfComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
