import { TestBed } from '@angular/core/testing';

import { UnitPlansService } from './unit-plans.service';

describe('UnitPlansService', () => {
  let service: UnitPlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitPlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
