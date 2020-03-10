import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';
import { Component } from '@angular/core';
describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let testHostFixture : ComponentFixture<MockParent>
  let testHostComponent : MockParent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmModalComponent ,MockParent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    testHostFixture = TestBed.createComponent(MockParent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges()
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read input @confirmText from parent and render it a template', () => {
    let element = <HTMLElement>testHostFixture.debugElement.nativeElement;
    expect(element.querySelector(".confirm-text").textContent).toEqual('testing confirm');
  });

  it('should read input @confirmHeader from parent and render it a template', () => {
    let element = <HTMLElement>testHostFixture.debugElement.nativeElement;
    expect(element.querySelector("#confirmationModal").textContent).toEqual('teasing header');
  });

  it('check weather output property is working or not',async(()=>{
    let value = {key:"key", value:"value"}
    component.confirm.subscribe(data =>{
      expect(data).toBeFalsy;
      expect(component.confirm.emit).toHaveBeenCalled;
    })
    component.onConfirm()
  }))

  it('if confirm header and customId is not provided then show set it to "Confirmation" and "confirmationModal" respectively',()=>{
    component.confirmHeader = null;
    component.customId = null;
    component.ngOnChanges();
    expect(component.confirmHeader).toEqual('Confirmation')
    expect(component.customId).toEqual('confirmationModal')
  })
  @Component({
    selector:'mock-parent',
    template:`<app-confirm-modal (confirm)='triggerOutPutEvent()' confirmText='testing confirm' confirmHeader='teasing header' customId = 'testing Id'></app-confirm-modal>`
  })
  class MockParent {
    triggerOutPutEvent(){
    }
  }
});



