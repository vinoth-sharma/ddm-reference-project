import { async, TestBed } from '@angular/core/testing';
import { SemanticLayerMainComponent } from './semantic-layer-main.component';
describe('SemanticLayerMainComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [SemanticLayerMainComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(SemanticLayerMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=semantic-layer-main.component.spec.js.map