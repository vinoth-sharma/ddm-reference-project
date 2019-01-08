import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { propertyComponent } from './property.component';

describe('propertyComponent', () => {
  let component: propertyComponent;
  let fixture: ComponentFixture<propertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ propertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(propertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
