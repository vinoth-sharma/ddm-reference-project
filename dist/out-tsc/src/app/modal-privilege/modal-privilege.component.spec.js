import { async, TestBed } from '@angular/core/testing';
import { ModalPrivilegeComponent } from './modal-privilege.component';
describe('ModalPrivilegeComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [ModalPrivilegeComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(ModalPrivilegeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=modal-privilege.component.spec.js.map