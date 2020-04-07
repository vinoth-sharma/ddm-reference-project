import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoModalComponent } from './info-modal.component';

describe('InfoModalComponent', () => {
  let component: InfoModalComponent;
  let fixture: ComponentFixture<InfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the values of editInfo() before Loading',()=>{
    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isEditable).toBeFalsy();
    expect(component.editBtnActive).toBeTruthy();
    expect(component.isUnchanged).toBeTruthy();
  })

  it('should check the values of editInfo() after Loading',()=>{
    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.editInfo(); // ADD A CLICK EVENT STEP HERE
    expect(component.isEditable).toBeTruthy();
    expect(component.editBtnActive).toBeFalsy();
    expect(component.isUnchanged).toBeFalsy();
  })

  it('should check the values of reset() before Loading',()=>{
    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isEditable).toBeFalsy();
    expect(component.editBtnActive).toBeTruthy();
    expect(component.isUnchanged).toBeTruthy();
    // expect(component.info).not.toEqual(component.tempInfo) || expect(component.info).toEqual(component.tempInfo)
  })
  

  it('should check the values of reset() after Loading',()=>{
    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.reset(); // ADD A CLICK EVENT STEP HERE
    expect(component.isEditable).toBeFalsy();
    expect(component.editBtnActive).toBeTruthy();
    expect(component.isUnchanged).toBeTruthy();
    expect(component.info).toEqual(component.tempInfo)
  })

  it('should check the values of saveChanges() onLoading',()=>{
    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // component.reset(); // ADD A CLICK EVENT STEP HERE
    component.isEditable = true;
    fixture.detectChanges();
    let compiled = fixture.nativeElement;
    if(compiled.querySelector('textarea').textarea === undefined){
      compiled.querySelector('textarea').textarea = '';
    }
    expect(compiled.querySelector('textarea').textarea).toEqual(component.tempInfo || '')
    // expect(compiled.querySelector('textarea')).toEqual(component.info || '')
  })
  
  it('should check the values of saveChanges() after clicking',()=>{
    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    let spyVar = spyOn(component.saveOption, 'emit')
    fixture.detectChanges();
    component.saveChanges(); // ADD A CLICK EVENT STEP HERE
    component.isEditable = true;
    fixture.detectChanges();
    let compiled = fixture.nativeElement;
    if(compiled.querySelector('textarea').textarea === undefined){
      compiled.querySelector('textarea').textarea = '';
    }
    expect(compiled.querySelector('textarea').textarea).toEqual(component.info || '')
    expect(component.emittingObject['OriginalValue']).toEqual(component.tempInfo || '')
    expect(component.emittingObject['ChangedValue']).toEqual(component.info || '')
    expect(spyVar).toHaveBeenCalled();
  })
});
