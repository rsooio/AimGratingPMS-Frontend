import { TestBed } from '@angular/core/testing';

import { StafferGuard } from './staffer.guard';

describe('StafferGuard', () => {
  let guard: StafferGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StafferGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
