import { TestBed } from '@angular/core/testing';

import { AuthSsoService } from './auth-sso.service';

describe('AuthSsoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthSsoService = TestBed.get(AuthSsoService);
    expect(service).toBeTruthy();
  });
});
