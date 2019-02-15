import { TestBed } from '@angular/core/testing';

import { SemanticNewService } from './semantic-new.service';

describe('SemanticNewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SemanticNewService = TestBed.get(SemanticNewService);
    expect(service).toBeTruthy();
  });
});
