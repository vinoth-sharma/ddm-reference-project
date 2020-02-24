import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependentsModalComponent } from './dependents-modal.component';

describe('DependentsModalComponent', () => {
  let component: DependentsModalComponent;
  let fixture: ComponentFixture<DependentsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependentsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependentsModalComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show input data in the table',async(()=>{
    fixture = TestBed.createComponent(DependentsModalComponent);
    component = fixture.debugElement.componentInstance;
    let reportData = [
      {report_name:"name",created_by:"createdBy"}
    ]
    component.reports = reportData;
    fixture.detectChanges();
   let compiled = fixture.debugElement.nativeElement;
  
   expect(compiled.querySelector('tbody > tr').children[0].textContent).toContain('name');
   expect(compiled.querySelector('tbody > tr').children[1].textContent).toContain('createdBy')
  }))
});
