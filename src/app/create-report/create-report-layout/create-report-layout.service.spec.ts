import { TestBed } from '@angular/core/testing';

import { CreateReportLayoutService } from './create-report-layout.service';

describe('CreateReportLayoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateReportLayoutService = TestBed.get(CreateReportLayoutService);
    expect(service).toBeTruthy();
  });
});
