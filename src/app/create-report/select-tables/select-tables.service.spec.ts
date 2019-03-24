import { TestBed } from '@angular/core/testing';

import { SelectTablesService } from './select-tables.service';

describe('SelectTablesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectTablesService = TestBed.get(SelectTablesService);
    expect(service).toBeTruthy();
  });
});
