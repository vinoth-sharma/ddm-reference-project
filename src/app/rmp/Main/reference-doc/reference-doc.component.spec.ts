import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDocComponent } from './reference-doc.component';

describe('ReferenceDocComponent', () => {
  let component: ReferenceDocComponent;
  let fixture: ComponentFixture<ReferenceDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
