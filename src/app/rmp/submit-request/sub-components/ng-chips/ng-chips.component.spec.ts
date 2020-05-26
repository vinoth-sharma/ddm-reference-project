import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgChipsComponent } from './ng-chips.component';

describe('NgChipsComponent', () => {
  let component: NgChipsComponent;
  let fixture: ComponentFixture<NgChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
