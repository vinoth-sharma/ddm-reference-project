import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticLayerMainComponent } from './semantic-layer-main.component';

describe('SemanticLayerMainComponent', () => {
  let component: SemanticLayerMainComponent;
  let fixture: ComponentFixture<SemanticLayerMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemanticLayerMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanticLayerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});