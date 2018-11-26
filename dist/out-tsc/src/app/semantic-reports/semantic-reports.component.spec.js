import { async, TestBed } from '@angular/core/testing';
import { SemanticReportsComponent } from './semantic-reports.component';
describe('SemanticReportsComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [SemanticReportsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(SemanticReportsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=semantic-reports.component.spec.js.map