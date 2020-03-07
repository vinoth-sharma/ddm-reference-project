import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareReportsComponent } from './share-reports.component';

xdescribe('ShareReportsComponent', () => {
  let component: ShareReportsComponent;
  let fixture: ComponentFixture<ShareReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
