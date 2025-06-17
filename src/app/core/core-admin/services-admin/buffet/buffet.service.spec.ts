/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BuffetService } from './buffet.service';

describe('Service: Buffet', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuffetService]
    });
  });

  it('should ...', inject([BuffetService], (service: BuffetService) => {
    expect(service).toBeTruthy();
  }));
});
