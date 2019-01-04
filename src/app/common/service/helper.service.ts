import { Injectable } from '@angular/core';
import { Booking } from 'src/app/booking/shared/booking.model';
import * as moment from 'moment';


@Injectable()
export class HelperService {

  private getRangeOfDates(startAt: string, endAt: string, dateFormat: string): string[] {
    const range: string[] = [];
    const end = moment(endAt);
    let start = moment(startAt);

    // Last day of booking is checkout day.
    // Another user can book on that day, therefore it is not blocked.
    while (start < end) {
      range.push(start.format(dateFormat));
      start = start.add(1, "day");
    }

    return range;
  }

  private formatDate(date: moment.Moment, dateFormat: string): string {
    return date.format(dateFormat);
  }

  public getBookingRangeOfDates(startAt: string, endAt: string): string[] {
    return this.getRangeOfDates(startAt, endAt, Booking.DATE_FORMAT);
  }

  public FormatBookingDate(date: moment.Moment): string {
    return this.formatDate(date, Booking.DATE_FORMAT);
  }

}