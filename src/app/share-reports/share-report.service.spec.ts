import { TestBed } from '@angular/core/testing';

import { ShareReportService } from './share-report.service';

describe('ShareReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareReportService = TestBed.get(ShareReportService);
    expect(service).toBeTruthy();
  });
});
