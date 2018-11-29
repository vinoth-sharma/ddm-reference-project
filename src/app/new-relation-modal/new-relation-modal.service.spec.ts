import { TestBed } from '@angular/core/testing';

import { NewRelationModalService } from './new-relation-modal.service';

describe('NewRelationModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewRelationModalService = TestBed.get(NewRelationModalService);
    expect(service).toBeTruthy();
  });
});
