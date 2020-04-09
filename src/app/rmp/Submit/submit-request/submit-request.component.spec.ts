import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { SubmitRequestComponent } from './submit-request.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('SubmitRequestComponent', () => {
  let component: SubmitRequestComponent;
  let fixture: ComponentFixture<SubmitRequestComponent>;
  let generatedReportService: GeneratedReportService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitRequestComponent ],
      providers : [ GeneratedReportService ],
      imports : [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should call getUsers and return list of users", async(() => {
    let response = false;  
    let serviceSpy= spyOn(generatedReportService, 'saveChanges').and.returnValue(of(response)); 
    spyOn(generatedReportService, 'saveUpdate').and.returnValue(of(response)); 
    component.ngOnInit();
    fixture.detectChanges();  
    expect(component.selectCriteria).toBeFalsy;
    expect(component.update).toBeFalsy;
    expect(serviceSpy).toHaveBeenCalled();
  }));
});