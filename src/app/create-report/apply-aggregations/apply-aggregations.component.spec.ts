import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyAggregationsComponent } from './apply-aggregations.component';

describe('ApplyAggregationsComponent', () => {
  let component: ApplyAggregationsComponent;
  let fixture: ComponentFixture<ApplyAggregationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyAggregationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyAggregationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
