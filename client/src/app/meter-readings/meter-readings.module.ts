import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';

import { MeterReadingsComponent } from './meter-readings.component';

import { MeterReadingsService } from './shared/meter-readings.service';

@NgModule({
    imports: [SharedModule, HttpModule],
    exports: [MeterReadingsComponent],
    declarations: [MeterReadingsComponent],
    providers: [MeterReadingsService],
})
export class MeterReadingsModule { }
