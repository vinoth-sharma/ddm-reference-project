import { TestBed } from '@angular/core/testing';

import { CalculatedColumnReportService } from './calculated-column-report.service';

describe('CalculatedColumnReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalculatedColumnReportService = TestBed.get(CalculatedColumnReportService);
    expect(service).toBeTruthy();
  });
});
