import { TestBed } from '@angular/core/testing';

import { ErrorGuard } from './error.guard';

describe('ErrorGuard', () => {
  let service: ErrorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
