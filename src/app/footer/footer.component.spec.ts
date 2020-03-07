import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterComponent ]
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display company logo in a <img>',()=>{
    let template = <HTMLElement>fixture.debugElement.nativeElement
    expect(template.querySelector('img')).toBeTruthy()
  });

  it('should display app version in it',()=>{
    let template = <HTMLElement>fixture.debugElement.nativeElement
    expect(template.querySelector('#version').textContent).toContain(`v.${environment.version}`)
  });

  it('should display Privacy Policy ',()=>{
    let template = <HTMLElement>fixture.debugElement.nativeElement
    expect(template.querySelector('#copyrights').textContent).toContain("Privacy Policy")
  });
});
