import { TestBed } from '@angular/core/testing';

import { ClassPlansService } from './class-plans.service';

describe('ClassPlansService', () => {
  let service: ClassPlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassPlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
