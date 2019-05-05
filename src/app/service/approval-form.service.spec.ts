import { TestBed, inject } from '@angular/core/testing';

import { ApprovalFormService } from './approval-form.service';

describe('ApprovalFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApprovalFormService]
    });
  });

  it('should be created', inject([ApprovalFormService], (service: ApprovalFormService) => {
    expect(service).toBeTruthy();
  }));
});
