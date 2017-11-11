import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MeterReadingsService } from './../shared/meter-readings.service';
import { MeterReading } from './../shared/meter-reading';
import { MatTableDataSource } from '@angular/material';
import { MeterReadingListDeletePopupComponent } from './meter-reading-list-delete-popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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

  constructor(private readingsService: MeterReadingsService, public dialog: MatDialog) { }

  private filterAndSortReadings() {
    if (this.meterReadings) {
      // Clone meterReadings
      let readings = this.meterReadings.slice();

      // Sort meter readings by date descending.
      readings.sort((ra, rb) => rb.readingTs.getTime() - ra.readingTs.getTime());

      this.calculatePerDayUsage(readings);

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

  // Calculate heating per day and water per day
  private calculatePerDayUsage(meterReadings: MeterReading[]) {
    for (var i = 0; i < meterReadings.length; i++) {

      // To calculate usage we need to get the previous reading.
      // As the given array is sorted by reading time descending, we
      // get the previous reading on the next index of the array.
      var prevReading = meterReadings[i + 1];
      if (prevReading !== undefined) {

        var numberOfMilliseconds = (meterReadings[i].readingTs.getTime() - prevReading.readingTs.getTime());

        var numberOfDays = numberOfMilliseconds / 1000 / 60 / 60 / 24;

        // And rounded to only one decimal..
        numberOfDays = Math.round(numberOfDays * 10) / 10;

        var heatingDiff = meterReadings[i].heating - prevReading.heating;
        var waterDiff = meterReadings[i].water - prevReading.water;

        meterReadings[i].numberOfDaysSinceLastReading = numberOfDays;
        meterReadings[i].heatingPerDay = Math.round((heatingDiff / numberOfDays) * 100) / 100;
        meterReadings[i].waterPerDay = Math.round((waterDiff / numberOfDays) * 100) / 100;
      }
    }
  }

  toggleListAll() {
    this.listAll = !this.listAll;
    this.filterAndSortReadings();
  }

  openDeleteDialog(meterReading: MeterReading) {
    let dialogRef = this.dialog.open(MeterReadingListDeletePopupComponent, {
      width: '250px',
      data: { meterReading }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result) {
        this.doDeleteMeterReading(meterReading);
      }
    });
  }

  requestDeleteMeterReading(meterReading: MeterReading) {
    this.openDeleteDialog(meterReading);
  }

  doDeleteMeterReading(meterReading: MeterReading) {
    this.readingsService.delete(meterReading.id)
      .then(() => {
        var index = this.meterReadingDataSource.data.indexOf(meterReading);
        this.meterReadingDataSource.data.splice(index, 1);
        this.meterReadingDataSource.data = this.meterReadingDataSource.data;
      });
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
