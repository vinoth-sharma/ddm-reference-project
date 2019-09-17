import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLovComponent } from './show-lov.component';

describe('ShowLovComponent', () => {
  let component: ShowLovComponent;
  let fixture: ComponentFixture<ShowLovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowLovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
