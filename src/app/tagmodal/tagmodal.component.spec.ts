import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagmodalComponent } from './tagmodal.component';

describe('TagmodalComponent', () => {
  let component: TagmodalComponent;
  let fixture: ComponentFixture<TagmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
