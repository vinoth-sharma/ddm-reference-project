import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticReportsComponent } from './semantic-reports.component';

describe('SemanticReportsComponent', () => {
  let component: SemanticReportsComponent;
  let fixture: ComponentFixture<SemanticReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemanticReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanticReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
