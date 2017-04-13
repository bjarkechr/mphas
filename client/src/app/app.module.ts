import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

/* Feature Modules */
import { MeterReadingsModule } from './meter-readings/meter-readings.module';

@NgModule({
  imports: [
    BrowserModule,
    MeterReadingsModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
