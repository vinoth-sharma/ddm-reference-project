import { TestBed } from '@angular/core/testing';

import { SecurityModalService } from './security-modal.service';

describe('SecurityModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecurityModalService = TestBed.get(SecurityModalService);
    expect(service).toBeTruthy();
  });
});
