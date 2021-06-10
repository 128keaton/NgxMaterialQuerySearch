import { TestBed } from '@angular/core/testing';

import { QuerySearchService } from './query-search.service';

describe('QuerySearchService', () => {
  let service: QuerySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuerySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
