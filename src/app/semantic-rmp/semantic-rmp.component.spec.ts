import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticRMPComponent } from './semantic-rmp.component';

describe('SemanticRMPComponent', () => {
  let component: SemanticRMPComponent;
  let fixture: ComponentFixture<SemanticRMPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemanticRMPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanticRMPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
