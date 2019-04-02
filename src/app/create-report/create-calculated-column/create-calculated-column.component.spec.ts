import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCalculatedColumnComponent } from './create-calculated-column.component';

describe('CreateCalculatedColumnComponent', () => {
  let component: CreateCalculatedColumnComponent;
  let fixture: ComponentFixture<CreateCalculatedColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCalculatedColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCalculatedColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
