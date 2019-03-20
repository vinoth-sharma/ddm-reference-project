import { TestBed } from '@angular/core/testing';

import { ReportConditionsService } from './report-conditions.service';

describe('ReportConditionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportConditionsService = TestBed.get(ReportConditionsService);
    expect(service).toBeTruthy();
  });
});
