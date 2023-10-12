import { TestBed } from '@angular/core/testing';

import { FirstNameService } from './first-name.service';

describe('FirstNameService', () => {
  let service: FirstNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
