import { async, 
          ComponentFixture,
          TestBed, 
          inject, 
          fakeAsync, 
          tick, 
          getTestBed 
        } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApplyAggregationsComponent } from './apply-aggregations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { NgToasterComponent } from '../../custom-directives/ng-toaster/ng-toaster.component';
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule,HttpErrorResponse,HttpClient } from '@angular/common/http';

describe('ApplyAggregationsComponent', () => {
  let component: ApplyAggregationsComponent;
  let fixture: ComponentFixture<ApplyAggregationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyAggregationsComponent ],
      imports: [ MatFormFieldModule,MatInputModule,
                 FormsModule, ReactiveFormsModule, MatAutocompleteModule,
                  MatGridListModule, NoopAnimationsModule,
                  RouterTestingModule.withRoutes([]),
                  MatCardModule, HttpClientTestingModule],
      providers:[NgToasterComponent,MatSnackBar]            
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyAggregationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
