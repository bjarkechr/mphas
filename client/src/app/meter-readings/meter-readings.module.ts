import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdInputModule, MdCardModule, MdButtonModule, MdSidenavModule, MdToolbarModule } from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { MeterReadingsComponent } from './meter-readings.component';
import { MeterReadingsService } from './shared/meter-readings.service';

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
    declarations: [MeterReadingsComponent],
    providers: [MeterReadingsService],
})
export class MeterReadingsModule { }
