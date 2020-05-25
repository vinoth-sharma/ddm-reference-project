import { TestBed } from '@angular/core/testing';

import { SubmitRequestService } from './submit-request.service';

describe('SubmitRequestService', () => {
  let service: SubmitRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmitRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
