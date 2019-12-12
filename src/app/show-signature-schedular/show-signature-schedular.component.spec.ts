import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSignatureSchedularComponent } from './show-signature-schedular.component';

describe('ShowSignatureSchedularComponent', () => {
  let component: ShowSignatureSchedularComponent;
  let fixture: ComponentFixture<ShowSignatureSchedularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowSignatureSchedularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSignatureSchedularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
