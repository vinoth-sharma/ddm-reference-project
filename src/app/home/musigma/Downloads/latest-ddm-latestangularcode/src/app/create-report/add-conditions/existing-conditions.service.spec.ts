import { TestBed } from '@angular/core/testing';

import { ExistingConditionsService } from './existing-conditions.service';

describe('ExistingConditionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExistingConditionsService = TestBed.get(ExistingConditionsService);
    expect(service).toBeTruthy();
  });
});
