import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdInputModule, MdCardModule, MdButtonModule, MdSidenavModule, MdToolbarModule } from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { MeterReadingsComponent } from './meter-readings.component';
import { MeterReadingsService } from './shared/meter-readings.service';
import { MeterReadingListComponent } from './meter-reading-list/meter-reading-list.component';
import { AddMeterReadingComponent } from './add-meter-reading/add-meter-reading.component';

@NgModule({
    imports: [
        SharedModule,
        HttpModule,
        BrowserAnimationsModule,
        MdInputModule,
        MdCardModule,
        MdButtonModule,
        MdSidenavModule,
        MdToolbarModule
    ],
    exports: [MeterReadingsComponent],
    declarations: [
        MeterReadingsComponent,
        MeterReadingListComponent,
        AddMeterReadingComponent
    ],
    providers: [MeterReadingsService],
})
export class MeterReadingsModule { }
