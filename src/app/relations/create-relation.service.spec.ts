import { TestBed } from '@angular/core/testing';

import { CreateRelationService } from './create-relation.service';

describe('CreateRelationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateRelationService = TestBed.get(CreateRelationService);
    expect(service).toBeTruthy();
  });
});
