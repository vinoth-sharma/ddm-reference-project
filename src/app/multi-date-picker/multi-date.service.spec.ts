import { TestBed } from '@angular/core/testing';

import { MultiDateService } from './multi-date.service';

describe('MultiDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MultiDateService = TestBed.get(MultiDateService);
    expect(service).toBeTruthy();
  });
});
