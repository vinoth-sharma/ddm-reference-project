import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCustomSpinnerComponent } from './ng-custom-spinner.component';

describe('NgCustomSpinnerComponent', () => {
  let component: NgCustomSpinnerComponent;
  let fixture: ComponentFixture<NgCustomSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgCustomSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgCustomSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
