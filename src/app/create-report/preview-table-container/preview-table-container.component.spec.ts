import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewTableContainerComponent } from './preview-table-container.component';

describe('PreviewTableContainerComponent', () => {
  let component: PreviewTableContainerComponent;
  let fixture: ComponentFixture<PreviewTableContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewTableContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewTableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
