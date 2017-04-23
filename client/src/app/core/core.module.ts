import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormatAndParseDateHelperService } from './format-and-parse-date-helper.service';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [FormatAndParseDateHelperService]
})
export class CoreModule { }
