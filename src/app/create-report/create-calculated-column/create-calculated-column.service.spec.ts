import { TestBed } from '@angular/core/testing';

import { CreateCalculatedColumnService } from './create-calculated-column.service';

describe('CreateCalculatedColumnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateCalculatedColumnService = TestBed.get(CreateCalculatedColumnService);
    expect(service).toBeTruthy();
  });
});
