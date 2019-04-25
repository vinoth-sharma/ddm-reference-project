import { TestBed } from '@angular/core/testing';

import { GeneratedReportService } from './generated-report.service';

describe('GeneratedReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneratedReportService = TestBed.get(GeneratedReportService);
    expect(service).toBeTruthy();
  });
});
