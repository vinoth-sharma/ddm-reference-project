import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticExistingComponent } from './semantic-existing.component';

describe('SemanticExistingComponent', () => {
  let component: SemanticExistingComponent;
  let fixture: ComponentFixture<SemanticExistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemanticExistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanticExistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
