import { TestBed } from '@angular/core/testing';

import { MultipleDatesSelectionService } from './multiple-dates-selection.service';

describe('MultipleDatesSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MultipleDatesSelectionService = TestBed.get(MultipleDatesSelectionService);
    expect(service).toBeTruthy();
  });
});
