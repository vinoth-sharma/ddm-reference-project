import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependentsModalComponent } from './dependents-modal.component';

describe('DependentsModalComponent', () => {
  let component: DependentsModalComponent;
  let fixture: ComponentFixture<DependentsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependentsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
