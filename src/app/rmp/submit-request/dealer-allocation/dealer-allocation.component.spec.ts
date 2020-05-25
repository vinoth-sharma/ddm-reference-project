import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerAllocationComp } from './dealer-allocation.component';

describe('DealerAllocationComp', () => {
  let component: DealerAllocationComp;
  let fixture: ComponentFixture<DealerAllocationComp>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerAllocationComp ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerAllocationComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
