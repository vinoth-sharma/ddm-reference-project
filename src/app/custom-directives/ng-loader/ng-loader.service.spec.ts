import { TestBed } from '@angular/core/testing';

import { NgLoaderService } from './ng-loader.service';

describe('NgLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgLoaderService = TestBed.get(NgLoaderService);
    expect(service).toBeTruthy();
  });

  it('should show the spinner when show is called', () => {
    const service: NgLoaderService = TestBed.get(NgLoaderService);
    let spy = spyOn(service,"show");
    service.show();
    expect(spy).toHaveBeenCalled();
  });

  it('should hide the spinner when hide is called', () => {
    const service: NgLoaderService = TestBed.get(NgLoaderService);
    let spy = spyOn(service,"hide");
    service.hide();
    expect(spy).toHaveBeenCalled();
  });
});
