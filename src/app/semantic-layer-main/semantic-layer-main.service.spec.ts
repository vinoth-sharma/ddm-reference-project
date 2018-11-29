import { TestBed } from '@angular/core/testing';

import { SemanticLayerMainService } from './semantic-layer-main.service';

describe('SemanticLayerMainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SemanticLayerMainService = TestBed.get(SemanticLayerMainService);
    expect(service).toBeTruthy();
  });
});
