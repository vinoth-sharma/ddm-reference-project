import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LovContainerComponent } from './lov-container.component';

describe('LovContainerComponent', () => {
  let component: LovContainerComponent;
  let fixture: ComponentFixture<LovContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LovContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LovContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
