import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatMultiselectComponent } from './mat-multiselect.component';

describe('MatMultiselectComponent', () => {
  let component: MatMultiselectComponent;
  let fixture: ComponentFixture<MatMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
