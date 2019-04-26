import { TestBed } from '@angular/core/testing';

import { MultiDatesService } from './multi-dates.service';

describe('MultiDatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MultiDatesService = TestBed.get(MultiDatesService);
    expect(service).toBeTruthy();
  });
});
