import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { MeterReadingsService } from './shared/meter-readings.service';
import { MeterReading } from './shared/meter-reading';

@Component({
    selector: 'meter-readings',
    templateUrl: './meter-readings.component.html',
    styleUrls: ['./meter-readings.component.css']
})

export class MeterReadingsComponent implements OnInit {

    meterReadings: MeterReading[];

    constructor(private readingsService: MeterReadingsService) { }

    getMeterReadings(): void {
        this.readingsService.getMeterReadings()
            .then(readings => this.meterReadings = readings);
    }

    onMeterReadingAdded(meterReading: MeterReading) {
        // Clone meterReadings and add new reading to clone.
        let readings = this.meterReadings.slice();
        readings.push(meterReading);
        
        // Set meterReadings property to cloned array. All of this to make change detection work!
        this.meterReadings = readings;
    }

    reloadMeterReadings() {
        this.getMeterReadings();
    }

    ngOnInit() {
        this.getMeterReadings();
    }
}