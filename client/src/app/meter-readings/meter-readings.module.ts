import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatInputModule, MatCardModule, MatButtonModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

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
        MatTableModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule
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
