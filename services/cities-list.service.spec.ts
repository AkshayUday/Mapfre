import { TestBed } from '@angular/core/testing';

import { CitiesListService } from './cities-list.service';

describe('CitiesListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CitiesListService = TestBed.get(CitiesListService);
    expect(service).toBeTruthy();
  });
});
