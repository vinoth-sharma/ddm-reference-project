import { async, TestBed } from '@angular/core/testing';
import { ModalPrivilege1Component } from './modal-privilege1.component';
describe('ModalPrivilege1Component', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ModalPrivilege1Component]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ModalPrivilege1Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=modal-privilege1.component.spec.js.map