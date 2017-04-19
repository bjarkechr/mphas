import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MeterReading } from './../shared/meter-reading';

@Component({
  selector: 'meter-reading-list',
  templateUrl: './meter-reading-list.component.html',
  styleUrls: ['./meter-reading-list.component.css']
})
export class MeterReadingListComponent implements OnInit {

  private _meterReadings = new BehaviorSubject<MeterReading[]>([]);

  @Input()
  set meterReadings(value) {
    this._meterReadings.next(value);
  };
  get meterReadings() {
    return this._meterReadings.getValue();
  }

  filteredMeterReadings: MeterReading[];
  listAll: boolean = false;

  private filterAndSortReadings(meterReadings: MeterReading[]) {
    var readings = meterReadings;

    if (readings) {
      // Sort meter readings by date descending.
      readings.sort((ra, rb) => rb.readingTs.getTime() - ra.readingTs.getTime());

      // Only take top 5 if listAll is false.
      if (!this.listAll) {
        readings = readings.splice(0, 5);
      }
    }
    this.filteredMeterReadings = readings;
  }

  toggleListAll() {
    this.listAll = !this.listAll;
    this.filterAndSortReadings(this.meterReadings);
  }

  ngOnInit() {
    this._meterReadings
      .subscribe(r => {
        this.filterAndSortReadings(r);
      });
  }

  ngOnDestroy() {

  }




}
