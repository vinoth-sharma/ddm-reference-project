import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageTableParametersComponent } from "./manage-parameters.component";

describe('ManageTableParametersComponent', () => {
  let component: ManageTableParametersComponent;
  let fixture: ComponentFixture<ManageTableParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTableParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTableParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
