import { TestBed } from '@angular/core/testing';

import { SemanticReportsService } from './semantic-reports.service';

describe('SemanticReportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SemanticReportsService = TestBed.get(SemanticReportsService);
    expect(service).toBeTruthy();
  });
});
