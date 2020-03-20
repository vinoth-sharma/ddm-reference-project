import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinsHelpOptionComponent } from './joins-help-option.component';

describe('JoinsHelpOptionComponent', () => {
  let component: JoinsHelpOptionComponent;
  let fixture: ComponentFixture<JoinsHelpOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinsHelpOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinsHelpOptionComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges(true); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit False when click on X button',()=>{
    component.createRelate = true;
    component.selectTables = true;
    fixture.detectChanges()
    let spy = spyOn(component.resetCreateRelate,"emit")
    let temp =  fixture.debugElement.nativeElement;
    temp.querySelector('.close').click();
    expect(spy).toHaveBeenCalledWith(false)
  })

  it('should not show any content if createRelate and selectTable properties are set to false',()=>{
    component.createRelate = false;
    component.selectTables = false;
    let temp =  fixture.debugElement.nativeElement;
    expect(temp.querySelector('#joinHelp')).toBeFalsy()
  })
});
