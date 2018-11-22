import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticNewComponent } from './semantic-new.component';

describe('SemanticNewComponent', () => {
  let component: SemanticNewComponent;
  let fixture: ComponentFixture<SemanticNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemanticNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanticNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
