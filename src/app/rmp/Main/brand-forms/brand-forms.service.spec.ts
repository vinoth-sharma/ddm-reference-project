import { TestBed } from '@angular/core/testing';

import { BrandFormsService } from './brand-forms.service';

describe('BrandFormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrandFormsService = TestBed.get(BrandFormsService);
    expect(service).toBeTruthy();
  });
});
