import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatedColumnComponent } from './calculated-column.component';

describe('CalculatedColumnComponent', () => {
  let component: CalculatedColumnComponent;
  let fixture: ComponentFixture<CalculatedColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatedColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatedColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
