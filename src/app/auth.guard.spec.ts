import { TestBed, async, inject } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthSsoService } from './auth-sso.service';


fdescribe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
      imports : [HttpClientTestingModule]
    });
  });

  it('should create auth guard ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('can activate func truthy ...', inject([AuthGuard], (guard: AuthGuard) => {
    let authService = TestBed.inject(AuthSsoService)
    spyOn(authService, 'getTokenId').and.returnValue("DUMMY");
    expect(guard.canActivate()).toEqual(true);
  }));

  it('can activate func falsy ...', inject([AuthGuard], (guard: AuthGuard) => {
    let authService = TestBed.inject(AuthSsoService)
    spyOn(authService, 'getTokenId').and.returnValue("");
    expect(guard.canActivate()).toEqual(false);
  }));

});
