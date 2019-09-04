import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContainerWrapperComponent } from './table-container-wrapper.component';

describe('TableContainerWrapperComponent', () => {
  let component: TableContainerWrapperComponent;
  let fixture: ComponentFixture<TableContainerWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableContainerWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableContainerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
