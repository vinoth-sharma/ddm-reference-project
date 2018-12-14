import { TestBed } from '@angular/core/testing';

import { ObjectExplorerSidebarService } from './object-explorer-sidebar.service';

describe('ObjectExplorerSidebarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectExplorerSidebarService = TestBed.get(ObjectExplorerSidebarService);
    expect(service).toBeTruthy();
  });
});
