import { TestBed } from '@angular/core/testing';

import { DidacticResourceService } from './didactic-resource.service';

describe('DidacticResourceService', () => {
  let service: DidacticResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DidacticResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
