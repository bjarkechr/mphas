import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { MeterReadingsComponent } from './meter-readings.component';

@NgModule({
    imports: [SharedModule],
    exports: [MeterReadingsComponent],
    declarations: [MeterReadingsComponent],
    providers: [],
})
export class MeterReadingsModule { }
