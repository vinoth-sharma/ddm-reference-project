import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopfilterComponent } from './topfilter.component';

describe('TopfilterComponent', () => {
  let component: TopfilterComponent;
  let fixture: ComponentFixture<TopfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
