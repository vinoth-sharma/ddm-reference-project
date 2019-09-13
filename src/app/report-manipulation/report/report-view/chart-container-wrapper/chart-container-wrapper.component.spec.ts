import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartContainerWrapperComponent } from './chart-container-wrapper.component';

describe('ChartContainerWrapperComponent', () => {
  let component: ChartContainerWrapperComponent;
  let fixture: ComponentFixture<ChartContainerWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartContainerWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartContainerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
