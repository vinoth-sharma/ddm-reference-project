import { async, 
        ComponentFixture,
        TestBed, 
        inject, 
        fakeAsync, 
        tick, 
        getTestBed 
      } from '@angular/core/testing';
import { SharedDataService } from '../shared-data.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { Observable, of, Subject } from 'rxjs';
import { GenerateReportModalComponent } from './generate-report-modal.component';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

describe('GenerateReportModalComponent', () => {
  let component: GenerateReportModalComponent;
  let fixture: ComponentFixture<GenerateReportModalComponent>;
  let shareService: SharedDataService;
  let shareServiceMock: any;
  let componentHelper: ComponentHelper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
          MatGridListModule, 
          FormsModule, 
          ReactiveFormsModule,
          MatFormFieldModule,
          MatInputModule,
          NoopAnimationsModule,
          RouterTestingModule.withRoutes([]),
          MatSelectModule
          
        ],
      declarations: [ GenerateReportModalComponent ],
      providers: [ SharedDataService, ActivatedRoute ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentHelper = new ComponentHelper();
  });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('execute typescript functions', () => { 
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should call getSaveAsDetails', fakeAsync(() => {
        const saveAsData = {
          'name': 'ganesh',
          'desc': 'descending',
          'requestDetailsForCloning': 1
        };
        component = fixture.componentInstance;
        let service = fixture.debugElement.injector.get(SharedDataService);
        spyOn(component.sharedDataService, 'getSaveAsDetails');
        component.sharedDataService.getSaveAsDetails();
        tick();
        fixture.detectChanges();
        component.sharedDataService.saveAsDetails.subscribe(data => expect(data).toBe(saveAsData));
      }));
    
      it('should check reset value', () => {
        fixture.detectChanges();
        componentHelper.currentName = 'ganesh';
        componentHelper.currentDesc = 'Desc';
        componentHelper.id = 1;
        fixture.detectChanges();
        componentHelper.reset();
        fixture.detectChanges();
        if(componentHelper.id) {
          expect(componentHelper.saveAsName.value).toEqual(componentHelper.currentName);
          expect(componentHelper.descForm.value).toEqual(componentHelper.currentDesc);
        } else{
          expect(componentHelper.saveAsName.value).toEqual('');
          expect(componentHelper.descForm.value).toEqual('');
        }
      });

      it('should update value', () => {
        fixture.detectChanges();
        component.saveAsName.setValue('Ganesh');
        component.descForm.setValue('Desc');
        component.selectedCloneId = 1;
        const result = {
          'name': 'Ganesh',
          'desc': 'Desc',
          'cloneId': 1
        };
        fixture.detectChanges();
        component.updateData();
        fixture.detectChanges();
        expect(component.saveAsName.value).toEqual(component.saveAsName.value);
        expect(component.descForm.value).toEqual(component.descForm.value);
        component.saveData.subscribe(res => expect(res).toEqual(result));
      })
    });
});


class ComponentHelper  {
  public currentName;
  public currentDesc;
  public id ;
  public saveAsName: FormControl = new FormControl();
  public descForm:  FormControl = new FormControl();

  public reset() {
    if(this.id){
      this.saveAsName.setValue(this.currentName);
      this.descForm.setValue(this.currentDesc);
    }else{
      this.saveAsName.setValue("");
      this.descForm.setValue("");
    }
  }
}
