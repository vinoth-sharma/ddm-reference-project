import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderToSaleComponent } from './order-to-sale.component';

describe('OrderToSaleComponent', () => {
  let component: OrderToSaleComponent;
  let fixture: ComponentFixture<OrderToSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderToSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderToSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
