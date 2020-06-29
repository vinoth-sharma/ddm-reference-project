import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListModalComponent } from './file-list-modal.component';

describe('FileListModalComponent', () => {
  let component: FileListModalComponent;
  let fixture: ComponentFixture<FileListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
