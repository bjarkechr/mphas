import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { MeterReadingsService } from './../shared/meter-readings.service';
import { MeterReading } from './../shared/meter-reading';

@Component({
  selector: 'add-meter-reading',
  templateUrl: './add-meter-reading.component.html',
  styleUrls: ['./add-meter-reading.component.css']
})
export class AddMeterReadingComponent implements OnInit {

  @Output() meterReadingAdded = new EventEmitter();

  // Forms input variables
  heating: number;
  water: number;
  readingTsStr: string;

  constructor(private readingsService: MeterReadingsService) { }

  onSubmit() {
    // Create meterReading object from form input variables
    var newReading = new MeterReading();
    newReading.heating = this.heating;
    newReading.water = this.water;
    newReading.readingTs = !this.readingTsStr ? new Date() : new Date(this.readingTsStr);

    try {
      this.readingsService.create(newReading)
        .then(reading => {
          let meterReading = reading;
          this.meterReadingAdded.emit(meterReading);
        });
    }
    catch (ex) {
      console.log(ex);
    }
  }

  newReading() {
    this.heating = null;
    this.water = null;
    this.readingTsStr = undefined;
  }

  ngOnInit() {
  }
}