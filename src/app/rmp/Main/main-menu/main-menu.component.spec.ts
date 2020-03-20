import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MainMenuComponent } from './main-menu.component';
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { SharedDataService } from 'src/app/create-report/shared-data.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { RouterTestingModule } from "@angular/router/testing";
import { Router ,RouterModule} from "@angular/router";
import { HttpClientTestingModule } from '@angular/common/http/testing';
 
describe('MainMenuComponent', () => {
 let component: MainMenuComponent;
 let fixture: ComponentFixture<MainMenuComponent>;
 let sharedDataService: SharedDataService;
 let authenticationService: AuthenticationService;
 let router: Router;
 
 // SharedDataService provided to the TestBed
 let el: DebugElement;
 
 beforeEach(async(() => {
 // refine the test module by declaring the test component
 TestBed.configureTestingModule({
 declarations: [MainMenuComponent],
 imports: [RouterTestingModule, HttpClientTestingModule],
 providers: []
 })
 .compileComponents();
 }));
 
 beforeEach(() => {
 // create component and test fixture
 fixture = TestBed.createComponent(MainMenuComponent);
 // get test component from the fixture
 component = fixture.componentInstance;
// fixture.detectChanges();
 router = TestBed.get(Router);
 });
 
 it("Should be ", fakeAsync(() => {
// const component = fixture.componentInstance;
// const service: SharedDataService = TestBed.inject(SharedDataService);
// component.sharedDataService.setRequestId(0);
// tick();
// // expect(service.setRequestId).toBeDefined();
// fixture.detectChanges();
// // component.role();
// expect(service.setRequestId).toEqual(0);
 let sharedService = TestBed.inject(SharedDataService);
 let router = TestBed.inject(Router);
 spyOn(router, 'navigate');
 component.role();
 expect(sharedService.getRequestId()).toEqual(0)
 }));
 
 it('Calling role() should navigate to semantic', async(() => {
 const component = fixture.componentInstance;
 let router = TestBed.inject(Router);
 let navigateSpy = spyOn(router, 'navigate');
 component.role();
 expect(navigateSpy).toHaveBeenCalledWith(['semantic']);
 }));
 
 it('should create', () => {
 expect(component).toBeTruthy();
 });
});