import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BookingService {

  constructor(private http: HttpClient) { }

  public createBooking(formData: any) : Observable<any> {
    return this.http.post("api/v1/bookings", formData);
  }

  public getUserBookings() : Observable<any> {
    return this.http.get("api/v1/bookings/manage");
  }

}
