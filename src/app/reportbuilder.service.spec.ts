import { TestBed } from '@angular/core/testing';

import { ReportbuilderService } from './reportbuilder.service';

describe('ReportbuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportbuilderService = TestBed.get(ReportbuilderService);
    expect(service).toBeTruthy();
  });
});
