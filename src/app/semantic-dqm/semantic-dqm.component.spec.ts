import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticDQMComponent } from './semantic-dqm.component';

describe('SemanticDQMComponent', () => {
  let component: SemanticDQMComponent;
  let fixture: ComponentFixture<SemanticDQMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemanticDQMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanticDQMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
