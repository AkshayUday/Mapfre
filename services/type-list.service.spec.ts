import { TestBed } from '@angular/core/testing';

import { TypeListService } from './type-list.service';

describe('TypeListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypeListService = TestBed.get(TypeListService);
    expect(service).toBeTruthy();
  });
});
