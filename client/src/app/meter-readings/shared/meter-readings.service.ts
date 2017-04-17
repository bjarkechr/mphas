import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { MeterReading } from './meter-reading';
import { ReadingTs } from './reading-ts';

@Injectable()
export class MeterReadingsService {

  private headers = new Headers({ 'Origin': 'http://localhost' });
  private meterReadingsUrl = 'http://bjarkechr.dk/mphas/server/index.php/MeterReadingsNew';  // URL to web api

  constructor(private http: Http) { }

  getMeterReadings(): Promise<MeterReading[]> {
    return this.http.get(this.meterReadingsUrl)
      .toPromise()
      .then(promise => this.extractData(promise))
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.meterReadingsUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
  create(name: string): Promise<MeterReading> {
    return this.http
      .post(this.meterReadingsUrl, JSON.stringify({ name: name }), { headers: this.headers })
      .toPromise()
      .then(res => res.json().data as MeterReading)
      .catch(this.handleError);
  }

  private extractData(res: any): MeterReading[] {
    var readings = new Array<MeterReading>();

    var data = res.json();

    for (let entry of data) {
      var reading = new MeterReading();
      reading.id = entry.id;
      reading.readingTs = new Date(entry.readingTs);
      reading.heating = entry.heating;
      reading.water = entry.water;

      readings.push(reading);
    }
    return readings;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
