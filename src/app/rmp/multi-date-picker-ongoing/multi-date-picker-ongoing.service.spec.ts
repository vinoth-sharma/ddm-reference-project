import { TestBed } from '@angular/core/testing';

import { MultiDatePickerOngoingService } from './multi-date-picker-ongoing.service';

describe('MultiDatePickerOngoingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MultiDatePickerOngoingService = TestBed.get(MultiDatePickerOngoingService);
    expect(service).toBeTruthy();
  });
});
