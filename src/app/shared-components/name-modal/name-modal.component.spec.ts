import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameModalComponent } from './name-modal.component';

describe('NameModalComponent', () => {
  let component: NameModalComponent;
  let fixture: ComponentFixture<NameModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
