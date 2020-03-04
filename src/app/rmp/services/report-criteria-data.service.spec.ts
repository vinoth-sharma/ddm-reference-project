import { TestBed } from '@angular/core/testing';

import { RepotCriteriaDataService } from './report-criteria-data.service';

describe('ReportCriteriaDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RepotCriteriaDataService = TestBed.get(RepotCriteriaDataService);
    expect(service).toBeTruthy();
  });
});
