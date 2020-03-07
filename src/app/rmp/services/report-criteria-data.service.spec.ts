import { TestBed } from '@angular/core/testing';

import { RepotCriteriaDataService } from './report-criteria-data.service';

describe('RepotCriteriaDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RepotCriteriaDataService = TestBed.get(RepotCriteriaDataService);
    expect(service).toBeTruthy();
  });
});
