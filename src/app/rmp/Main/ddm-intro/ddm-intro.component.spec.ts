import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdmIntroComponent } from './ddm-intro.component';

describe('DdmIntroComponent', () => {
  let component: DdmIntroComponent;
  let fixture: ComponentFixture<DdmIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdmIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdmIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
