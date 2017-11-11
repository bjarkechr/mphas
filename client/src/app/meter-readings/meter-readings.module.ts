import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatInputModule, MatCardModule, MatButtonModule, 
    MatSidenavModule, MatToolbarModule, MatDialogModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { MeterReadingsComponent } from './meter-readings.component';
import { MeterReadingsService } from './shared/meter-readings.service';
import { MeterReadingListComponent } from './meter-reading-list/meter-reading-list.component';
import { AddMeterReadingComponent } from './add-meter-reading/add-meter-reading.component';
import { MeterReadingListDeletePopupComponent } from './meter-reading-list/meter-reading-list-delete-popup.component';

@NgModule({
    imports: [
        SharedModule,
        HttpModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatDialogModule
    ],
    exports: [MeterReadingsComponent],
    declarations: [
        MeterReadingsComponent,
        MeterReadingListComponent,
        AddMeterReadingComponent,
        MeterReadingListDeletePopupComponent
    ],
    entryComponents:
    [
        MeterReadingListDeletePopupComponent
    ],
    providers: [MeterReadingsService],
})
export class MeterReadingsModule { }
