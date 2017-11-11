import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { MeterReading } from './meter-reading';
import { ReadingTs } from './reading-ts';
import { FormatAndParseDateHelperService } from './../../core/format-and-parse-date-helper.service';

@Injectable()
export class MeterReadingsService {

  private headers = new Headers({ 'Origin': 'http://localhost' });
  private meterReadingsUrl = 'http://bjarkechr.dk/mphas/server/index.php/MeterReadingsNew';  // URL to web api

  constructor(private http: Http, private dateHelperService: FormatAndParseDateHelperService) { }

  getMeterReadings(): Promise<MeterReading[]> {
    return this.http.get(this.meterReadingsUrl)
      .toPromise()
      .then(promise => this.extractMeterReadings(promise))
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.meterReadingsUrl}/${id}`;
    return this.http.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(meterReading: MeterReading): Promise<MeterReading> {
    const readingJson = this.meterReadingToJson(meterReading);
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf8;' });

    return this.http
      .post(this.meterReadingsUrl, readingJson, { headers: headers })
      .toPromise()
      .then(res => this.extractMeterReading(res))
      .catch(this.handleError);
  }

  private extractMeterReadings(res: any): MeterReading[] {
    var readings = new Array<MeterReading>();

    var data = res.json();

    for (let entry of data) {
      var reading = this.dataToMeterReading(entry);

      readings.push(reading);
    }
    return readings;
  }

  private extractMeterReading(res: any): MeterReading {
    var data = res.json();
    return this.dataToMeterReading(data);
  }

  private dataToMeterReading(data: any): MeterReading {
    var reading = new MeterReading();
    reading.id = data.id;
    reading.readingTs = new Date(data.readingTs);
    reading.heating = data.heating;
    reading.water = data.water;

    return reading;
  }

  private meterReadingToJson(reading: MeterReading): string {
    return JSON.stringify(reading, (key, value) => {
      if (key === "readingTs") {
        // Date has already been converted to a string by stringify (sigh)
        // To get ISO string convert back to date and then call toISOString
        var date = new Date(value);

        return this.dateHelperService.dateToServerString(date);
      }
      else {
        return value;
      }
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
