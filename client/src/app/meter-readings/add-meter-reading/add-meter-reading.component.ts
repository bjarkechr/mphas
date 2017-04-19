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

  // this.meterReadingAdded.emit();

  meterReading: MeterReading = new MeterReading();

  constructor(private readingsService: MeterReadingsService) { }

  onSubmit() {

  }

  newReading() {
    this.meterReading = new MeterReading();
  }

  ngOnInit() {
  }

}
