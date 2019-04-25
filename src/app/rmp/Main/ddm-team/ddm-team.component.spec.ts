import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdmTeamComponent } from './ddm-team.component';

describe('DdmTeamComponent', () => {
  let component: DdmTeamComponent;
  let fixture: ComponentFixture<DdmTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdmTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdmTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
