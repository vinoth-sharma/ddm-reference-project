import { TestBed } from '@angular/core/testing';

import { CalculatedColumnService } from './calculated-column.service';

describe('CalculatedColumnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalculatedColumnService = TestBed.get(CalculatedColumnService);
    expect(service).toBeTruthy();
  });
});
