import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectExplorerSidebarComponent } from './object-explorer-sidebar.component';

describe('ObjectExplorerSidebarComponent', () => {
  let component: ObjectExplorerSidebarComponent;
  let fixture: ComponentFixture<ObjectExplorerSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectExplorerSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectExplorerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
