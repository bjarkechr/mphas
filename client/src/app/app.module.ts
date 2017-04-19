import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import 'hammerjs';

/* Feature Modules */
import { MeterReadingsModule } from './meter-readings/meter-readings.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MeterReadingsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
