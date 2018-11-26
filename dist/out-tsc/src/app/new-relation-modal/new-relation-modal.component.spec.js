import { async, TestBed } from '@angular/core/testing';
import { NewRelationModalComponent } from './new-relation-modal.component';
describe('NewRelationModalComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [NewRelationModalComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(NewRelationModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=new-relation-modal.component.spec.js.map