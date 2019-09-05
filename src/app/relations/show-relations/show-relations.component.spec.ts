import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRelationsComponent } from './show-relations.component';

describe('ShowRelationsComponent', () => {
  let component: ShowRelationsComponent;
  let fixture: ComponentFixture<ShowRelationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRelationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
