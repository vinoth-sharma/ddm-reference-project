import { TestBed } from '@angular/core/testing';

import { ReportCriteriaDataService } from './report-criteria-data.service';

describe('ReportCriteriaDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportCriteriaDataService = TestBed.get(ReportCriteriaDataService);
    expect(service).toBeTruthy();
  });
});
