import { async, TestBed } from '@angular/core/testing';
import { ModalPrivilege2Component } from './modal-privilege2.component';
describe('ModalPrivilege2Component', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ModalPrivilege2Component]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ModalPrivilege2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=modal-privilege2.component.spec.js.map