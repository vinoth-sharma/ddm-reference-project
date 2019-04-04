import { TestBed } from '@angular/core/testing';

import { AddConditionsService } from './add-conditions.service';

describe('AddConditionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddConditionsService = TestBed.get(AddConditionsService);
    expect(service).toBeTruthy();
  });
});
