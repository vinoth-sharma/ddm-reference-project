import { async, TestBed } from '@angular/core/testing';
import { RmpLandingPageComponent } from './rmp-landing-page.component';
describe('RmpLandingPageComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [RmpLandingPageComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(RmpLandingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=rmp-landing-page.component.spec.js.map