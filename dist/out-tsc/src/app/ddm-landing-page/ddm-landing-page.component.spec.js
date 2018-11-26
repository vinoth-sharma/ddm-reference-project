import { async, TestBed } from '@angular/core/testing';
import { DdmLandingPageComponent } from './ddm-landing-page.component';
describe('DdmLandingPageComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [DdmLandingPageComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(DdmLandingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=ddm-landing-page.component.spec.js.map