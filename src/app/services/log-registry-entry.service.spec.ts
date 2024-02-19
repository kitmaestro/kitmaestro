import { TestBed } from '@angular/core/testing';

import { LogRegistryEntryService } from './log-registry-entry.service';

describe('LogRegistryEntryService', () => {
  let service: LogRegistryEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogRegistryEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
