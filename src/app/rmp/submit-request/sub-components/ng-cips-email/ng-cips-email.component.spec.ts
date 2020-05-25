import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCipsEmailComponent } from './ng-cips-email.component';

describe('NgCipsEmailComponent', () => {
  let component: NgCipsEmailComponent;
  let fixture: ComponentFixture<NgCipsEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgCipsEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgCipsEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
