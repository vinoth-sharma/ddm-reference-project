import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModallistComponent } from './modallist.component';

describe('ModallistComponent', () => {
  let component: ModallistComponent;
  let fixture: ComponentFixture<ModallistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModallistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
