import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurePivotComponent } from './configure-pivot.component';

describe('ConfigurePivotComponent', () => {
  let component: ConfigurePivotComponent;
  let fixture: ComponentFixture<ConfigurePivotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurePivotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurePivotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
