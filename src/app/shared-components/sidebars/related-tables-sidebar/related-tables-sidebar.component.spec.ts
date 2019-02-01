import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedTablesSidebarComponent } from './related-tables-sidebar.component';

describe('RelatedTablesSidebarComponent', () => {
  let component: RelatedTablesSidebarComponent;
  let fixture: ComponentFixture<RelatedTablesSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedTablesSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedTablesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
