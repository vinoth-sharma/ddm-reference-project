import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneParametersComponent } from './clone-parameters.component';

describe('CloneParametersComponent', () => {
  let component: CloneParametersComponent;
  let fixture: ComponentFixture<CloneParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloneParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
