import { TestBed } from '@angular/core/testing';

import { ListOfValuesService } from './list-of-values.service';

describe('ListOfValuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListOfValuesService = TestBed.get(ListOfValuesService);
    expect(service).toBeTruthy();
  });
});
