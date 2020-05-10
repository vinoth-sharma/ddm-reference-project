import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEventStatusComponent } from './vehicle-event-status.component';

describe('VehicleEventStatusComponent', () => {
  let component: VehicleEventStatusComponent;
  let fixture: ComponentFixture<VehicleEventStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleEventStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleEventStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
