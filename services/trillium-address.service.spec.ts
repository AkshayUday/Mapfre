import { TestBed } from '@angular/core/testing';

import { TrilliumAddressService } from './trillium-address.service';

describe('TrilliumAddressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrilliumAddressService = TestBed.get(TrilliumAddressService);
    expect(service).toBeTruthy();
  });
});
