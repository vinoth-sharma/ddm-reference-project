import { TestBed } from '@angular/core/testing';

import { SemdetailsService } from './semdetails.service';

describe('SemdetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SemdetailsService = TestBed.get(SemdetailsService);
    expect(service).toBeTruthy();
  });
});
