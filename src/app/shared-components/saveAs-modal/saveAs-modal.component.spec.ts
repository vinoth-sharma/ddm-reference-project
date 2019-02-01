import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAsModalComponent } from './saveAs-modal.component';

describe('NameModalComponent', () => {
  let component: SaveAsModalComponent;
  let fixture: ComponentFixture<SaveAsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveAsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
