import { Injectable } from '@angular/core';

@Injectable()
export class FormatAndParseDateHelperService {

  constructor() { }

  dateToServerString(date: Date) {
    return date.getUTCFullYear() +
      '-' + this.pad(date.getUTCMonth() + 1) +
      '-' + this.pad(date.getUTCDate()) +
      'T' + this.pad(date.getUTCHours()) +
      ':' + this.pad(date.getUTCMinutes()) +
      ':' + this.pad(date.getUTCSeconds()) +
      'Z';
  }

  private pad(number: number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

}
