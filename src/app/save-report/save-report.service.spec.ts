import { TestBed } from '@angular/core/testing';

import { SaveReportService } from './save-report.service';

describe('SaveReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveReportService = TestBed.get(SaveReportService);
    expect(service).toBeTruthy();
  });
});
