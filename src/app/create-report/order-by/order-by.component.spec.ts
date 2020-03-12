import { async, 
         ComponentFixture,
         TestBed, 
         inject, 
         fakeAsync, 
         tick, 
         getTestBed 
      } from '@angular/core/testing';
import { OrderByComponent } from './order-by.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { spaceFormaterString } from '../../custom-directives/spaceFormaterString.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MaximumCharacterPipe } from '../../shared-components/maximum-character.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule,HttpErrorResponse,HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { element } from 'protractor';

describe('OrderByComponent', () => {
  let component: OrderByComponent;
  let fixture: ComponentFixture<OrderByComponent>;
  let shareService: ShareDataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ 
                FormsModule, 
                MatFormFieldModule, 
                MatInputModule, 
                NoopAnimationsModule,
                RouterTestingModule.withRoutes([]),
                MatSelectModule,
                MatGridListModule,
                MatIconModule,
                MatCardModule,
                ToastrModule.forRoot(),
                HttpClientTestingModule
              ],
      declarations: [ 
                      OrderByComponent, 
                      spaceFormaterString, 
                      MaximumCharacterPipe 
                    ],
      providers: [ {
        provide: ShareDataService, useClass: ShareDataService
      } ]              
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderByComponent);
    component = fixture.componentInstance;
    shareService = new ShareDataService();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute getColumns() ', () => {
    let columnData = component.getColumns();
  });

  it('should check service', () =>{
    const a = ['a', '1', 'b', '2'];
    shareService.setSelectedTables(a).subscribe(res => {
      console.log(res, 'result checking----');
    })
  });

  it('should check orderBy data', fakeAsync(() => {
    fixture.detectChanges();
    const bannerDe: DebugElement = fixture.debugElement;
    const bannerEl: HTMLElement = bannerDe.nativeElement;
    component = fixture.componentInstance;
    component.ngOnInit();
    console.log(component.orderbyData, 'order by data--------');
    
    // console.log(bannerEl.querySelector('.order-by-data').textContent, 'text contant-----');
    // expect(bannerEl.querySelector('.order-by-data').textContent).toEqual('');
  }));

  // it('show delete row', fakeAsync(() =>{
  //   fixture.detectChanges();
  //   component = fixture.componentInstance;
  //   component.deleteRow(2);

  // }));

  it('should get mat-card', () => {
    fixture.detectChanges();
    const bannerDe: DebugElement = fixture.debugElement;
    const bannerEl: HTMLElement = bannerDe.nativeElement;
    console.log(bannerEl.querySelector('.order-by-data').textContent, 'checking mat card');
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      console.log(bannerEl.querySelector('.order-by-data').textContent, 'checking mat card after mat card');
      // expect(el.nativeElemen)
    })
  });

});

class ShareDataService {
  setSelectedTables(tables: any): Observable<any[]> {
    return of(tables);
  }
}


// fdescribe('Share data service', () => {
//   let httpClient: HttpClient;
//   let httpTestingController: HttpTestingController;
//   let shareDataService = ShareDataService;

//    // before each test, default value and delete old test
//    beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [ShareDataService]
//     });

//     // Inject the http, test controller, and service-under-test
//     // as they will be referenced by each test.
//     httpClient = TestBed.get(HttpClient);
//     httpTestingController = TestBed.get(HttpTestingController);
//     shareDataService = TestBed.get(ShareDataService);
//   });

//    // After every test, assert that there are no more pending requests.
//    afterEach(() => {
//     httpTestingController.verify();
//   });

//   describe('getCourses', () => {
//     // Mock Data to test the service
//     let expectedCourses;

//     beforeEach(() => {
//       shareDataService = TestBed.get(ShareDataService);
//       //expectedCourses = courseService.getCourses();

//       expectedCourses = [
//         { id: 1, title: "Angular is Fun", author: "Son Goku", segments: [
//           { id: 1, unit_id: 1, unit_title: "Components", name: "Lesson 1: Create Components", type: "Video", data: "www.hellokitty.com/angular1.flv" },
//           { id: 2, unit_id: 1, unit_title: "Components", name: "Lesson 2: Decorators", type: "Video", data: "www.hellokitty.com/angular2.flv" },
//           { id: 3, unit_id: 1, unit_title: "Components", name: "Lesson 3: Life Cycle", type: "Video", data: "www.hellokitty.com/angular3.flv" } ]
//         },
//         { id: 2, title: "Ruby on Rails", author: "Monokuma", segments: [
//           { id: 4, unit_id: 1, unit_title: "Introduction", name: "Lesson 1: Rails Console", type: "Video", data: "www.sdr2.com/rails1.flv" },
//           { id: 5, unit_id: 2, unit_title: "Introduction", name: "Lesson 1: Gems", type: "Video", data: "www.sdr2.com/rails2.flv" } ]
//         },
//         { id: 3, title: "Java", author: "Hououin Kyouma", segments: [
//           { id: 6, unit_id: 1, unit_title: "Data Structures", name: "Lesson 1: Node", type: "Video", data: "www.deathnote.com/java1.flv" },
//           { id: 7, unit_id: 1, unit_title: "Data Structures", name: "Lesson 2: Stack", type: "Video", data: "www.deathnote.com/java2.flv" },
//           { id: 8, unit_id: 1, unit_title: "Data Structures", name: "Lesson 3: List", type: "Video", data: "www.deathnote.com/java3.flv" }]
//         }
//       ] ;
//     });

//     // Test getCoures()
//     it('should return all courses', () => {
//       shareDataService.setSelectedTables().subscribe(
//         courses => expect(courses).toEqual(expectedCourses))
//     });

// });

// })
  


