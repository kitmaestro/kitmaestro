import { TestBed } from '@angular/core/testing';

import { ClassSectionService } from './class-section.service';

describe('ClassSectionService', () => {
  let service: ClassSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
