import { TestBed } from '@angular/core/testing';

import { PrivilegeModalService } from './privilege-modal.service';

describe('PrivilegeModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrivilegeModalService = TestBed.get(PrivilegeModalService);
    expect(service).toBeTruthy();
  });
});
