import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLovComponent } from './create-lov.component';

describe('CreateLovComponent', () => {
  let component: CreateLovComponent;
  let fixture: ComponentFixture<CreateLovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
