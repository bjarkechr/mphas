import { Component, OnInit } from '@angular/core';
import { MeterReadingsService } from './shared/meter-readings.service';
import { MeterReading } from './shared/meter-reading';

@Component({
    selector: 'meter-readings',
    templateUrl: './meter-readings.component.html'
})

export class MeterReadingsComponent implements OnInit {

    meterReadings: MeterReading[];

    constructor(private readingsService: MeterReadingsService) { }

    getMeterReadings(): void {
        this.readingsService.getMeterReadings()
            .then(readings => this.meterReadings = readings);
    }

    ngOnInit() {

        this.getMeterReadings();

    }
}