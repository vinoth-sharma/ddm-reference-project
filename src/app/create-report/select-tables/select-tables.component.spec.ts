import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectTablesComponent } from './select-tables.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrderByPipe } from '../../shared-components/filters/order-by.pipe';
import { MaximumCharacterPipe } from '../../shared-components/maximum-character.pipe';
import { spaceFormaterString } from '../../custom-directives/spaceFormaterString.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSelectModule } from '@angular/material/select';
import { AngularMultiSelectModule } from "angular4-multiselect-dropdown/angular4-multiselect-dropdown";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule,HttpErrorResponse } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ObjectExplorerSidebarService } from '../../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service';
import { SharedDataService } from '../shared-data.service';
import { SelectTablesService } from '../select-tables/select-tables.service';
import { of, BehaviorSubject } from 'rxjs';

describe('SelectTablesComponent', () => {
  let component: SelectTablesComponent;
  let fixture: ComponentFixture<SelectTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule,
                MatFormFieldModule,
                MatSelectModule,
                MatGridListModule,
                AngularMultiSelectModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                NoopAnimationsModule],
      declarations: [ SelectTablesComponent, OrderByPipe, MaximumCharacterPipe, spaceFormaterString ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check select table from SharedDataService', () => {
    const a = [
      '1', '2', '3', '4'
    ];
    let service = fixture.debugElement.injector.get(SharedDataService);
    service.setSelectedTables(a);
    fixture.autoDetectChanges();
    // let  spy = spyOn(service).and.returnValue(of(a));
    service.selectedTables.subscribe(res => {
      console.log(res, 'result----');
    })
  });

});
