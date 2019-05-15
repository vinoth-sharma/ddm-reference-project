import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSignaturesComponent } from './manage-signatures.component';

describe('ManageSignaturesComponent', () => {
  let component: ManageSignaturesComponent;
  let fixture: ComponentFixture<ManageSignaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSignaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
