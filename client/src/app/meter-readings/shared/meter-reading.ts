import { ReadingTs } from './reading-ts';

export class MeterReading {
    id: number;
    readingTs: Date;
    heating: number;
    water: number;
    numberOfDaysSinceLastReading: number;
    heatingPerDay: number;
    waterPerDay: number;
}
