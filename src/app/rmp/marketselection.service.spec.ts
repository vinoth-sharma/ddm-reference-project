import { TestBed } from '@angular/core/testing';

import { MarketselectionService } from './marketselection.service';

describe('MarketselectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarketselectionService = TestBed.get(MarketselectionService);
    expect(service).toBeTruthy();
  });
});
