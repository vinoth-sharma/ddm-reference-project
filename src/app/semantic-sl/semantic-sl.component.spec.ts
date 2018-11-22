import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticSLComponent } from './semantic-sl.component';

describe('SemanticSLComponent', () => {
  let component: SemanticSLComponent;
  let fixture: ComponentFixture<SemanticSLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemanticSLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanticSLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
