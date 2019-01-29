import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreOptionSidebarComponent } from './more-option-sidebar.component';

describe('MoreOptionSidebarComponent', () => {
  let component: MoreOptionSidebarComponent;
  let fixture: ComponentFixture<MoreOptionSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreOptionSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreOptionSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
