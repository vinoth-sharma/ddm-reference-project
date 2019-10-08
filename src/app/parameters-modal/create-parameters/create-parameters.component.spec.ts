import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateParametersComponent } from './create-parameters.component';

describe('CreateParametersComponent', () => {
  let component: CreateParametersComponent;
  let fixture: ComponentFixture<CreateParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
