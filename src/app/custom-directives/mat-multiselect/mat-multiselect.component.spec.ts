import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatMultiselect } from './mat-multiselect.component';

describe('MatMultiselect', () => {
  let component: MatMultiselect;
  let fixture: ComponentFixture<MatMultiselect>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatMultiselect ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatMultiselect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
