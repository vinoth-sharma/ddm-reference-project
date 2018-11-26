import { async, TestBed } from '@angular/core/testing';
import { SemanticExistingComponent } from './semantic-existing.component';
describe('SemanticExistingComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [SemanticExistingComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(SemanticExistingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=semantic-existing.component.spec.js.map