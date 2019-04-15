import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinsHelpOptionComponent } from './joins-help-option.component';

describe('JoinsHelpOptionComponent', () => {
  let component: JoinsHelpOptionComponent;
  let fixture: ComponentFixture<JoinsHelpOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinsHelpOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinsHelpOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
