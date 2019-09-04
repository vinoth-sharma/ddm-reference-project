import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneWorksheetComponent } from './clone-worksheet.component';

describe('CloneWorksheetComponent', () => {
  let component: CloneWorksheetComponent;
  let fixture: ComponentFixture<CloneWorksheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloneWorksheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneWorksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
