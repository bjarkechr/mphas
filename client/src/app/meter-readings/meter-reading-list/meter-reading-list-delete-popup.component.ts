import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-meter-reading-list-delete-popup',
  templateUrl: './meter-reading-list-delete-popup.component.html',
  styleUrls: ['./meter-reading-list-delete-popup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MeterReadingListDeletePopupComponent implements OnInit {

  readingId: string;

  constructor(public dialogRef: MatDialogRef<MeterReadingListDeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.readingId = data.meterReading.id;
  }

  ngOnInit() {
  }

}
