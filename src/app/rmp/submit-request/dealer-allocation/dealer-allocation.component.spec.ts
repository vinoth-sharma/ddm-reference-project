import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerAllocationComponent } from './dealer-allocation.component';

describe('DealerAllocationComponent', () => {
  let component: DealerAllocationComponent;
  let fixture: ComponentFixture<DealerAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
