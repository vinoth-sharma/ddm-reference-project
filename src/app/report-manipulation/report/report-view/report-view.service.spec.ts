import { TestBed } from '@angular/core/testing';

import { ReportViewService } from './report-view.service';

describe('ReportViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportViewService = TestBed.get(ReportViewService);
    expect(service).toBeTruthy();
  });
});
