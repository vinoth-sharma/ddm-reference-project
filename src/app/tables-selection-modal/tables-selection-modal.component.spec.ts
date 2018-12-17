import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesSelectionModalComponent } from './tables-selection-modal.component';

describe('TablesSelectionModalComponent', () => {
  let component: TablesSelectionModalComponent;
  let fixture: ComponentFixture<TablesSelectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablesSelectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
