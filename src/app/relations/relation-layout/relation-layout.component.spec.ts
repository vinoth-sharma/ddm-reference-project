import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationLayoutComponent } from './relation-layout.component';

describe('RelationLayoutComponent', () => {
  let component: RelationLayoutComponent;
  let fixture: ComponentFixture<RelationLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
