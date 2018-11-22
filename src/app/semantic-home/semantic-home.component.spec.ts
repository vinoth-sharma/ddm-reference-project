import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticHomeComponent } from './semantic-home.component';

describe('SemanticHomeComponent', () => {
  let component: SemanticHomeComponent;
  let fixture: ComponentFixture<SemanticHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemanticHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanticHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
