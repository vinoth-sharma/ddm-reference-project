import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRelationModalComponent } from './new-relation-modal.component';

describe('NewRelationModalComponent', () => {
  let component: NewRelationModalComponent;
  let fixture: ComponentFixture<NewRelationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRelationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRelationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
