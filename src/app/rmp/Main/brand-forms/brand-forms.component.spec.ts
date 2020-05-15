import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandFormsComponent } from './brand-forms.component';

describe('BrandFormsComponent', () => {
  let component: BrandFormsComponent;
  let fixture: ComponentFixture<BrandFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
