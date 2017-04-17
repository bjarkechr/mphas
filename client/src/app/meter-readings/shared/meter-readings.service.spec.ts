import { TestBed, inject } from '@angular/core/testing';

import { MeterReadingsService } from './meter-readings.service';

describe('MeterReadingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeterReadingsService]
    });
  });

  it('should ...', inject([MeterReadingsService], (service: MeterReadingsService) => {
    expect(service).toBeTruthy();
  }));
});
