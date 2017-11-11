import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MeterReadingsService } from './../shared/meter-readings.service';
import { MeterReading } from './../shared/meter-reading';
import {MatTableDataSource} from '@angular/material';


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

  listAll: boolean = false;
  meterReadingDataSource = new MatTableDataSource<MeterReading>();

  constructor(private readingsService: MeterReadingsService) { }

  private filterAndSortReadings() {
    if (this.meterReadings) {
      // Clone meterReadings
      let readings = this.meterReadings.slice();

      // Sort meter readings by date descending.
      readings.sort((ra, rb) => rb.readingTs.getTime() - ra.readingTs.getTime());

      // Only take top 5 if listAll is false.
      if (!this.listAll) {
        readings = readings.splice(0, 5);
      }
      this.meterReadingDataSource.data = readings;
    }
    else {
      this.meterReadingDataSource.data = new Array<MeterReading>();
    }
  }

  toggleListAll() {
    this.listAll = !this.listAll;
    this.filterAndSortReadings();
  }

  deleteMeterReading(meterReading: MeterReading) {
    console.log("Delete me!: " + meterReading.id);

    this.readingsService.delete(meterReading.id)
    // TODO add event about deletion and implement this in parent component!
      .then(() => { });
  }

  ngOnInit() {
    this._meterReadings
      .subscribe(r => {
        this.filterAndSortReadings();
      });
  }

  ngOnDestroy() {
    this._meterReadings.unsubscribe();
  }
}
