import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableParametersComponent } from './table-parameters.component';

describe('TableParametersComponent', () => {
  let component: TableParametersComponent;
  let fixture: ComponentFixture<TableParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
