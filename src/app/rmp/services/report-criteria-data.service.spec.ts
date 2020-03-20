import { TestBed } from '@angular/core/testing';

import { ReportCriteriaDataService } from './report-criteria-data.service';

describe('RepotCriteriaDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportCriteriaDataService = TestBed.get(ReportCriteriaDataService);
    expect(service).toBeTruthy();
  });
});
