import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Rental } from './rental.model';

@Injectable()
export class RentalService {

  constructor(private http: HttpClient) {  
  }

  public createRental(newRental: Rental) : Observable<any> {
    return this.http.post("api/v1/rentals", newRental);
  }

  public deleteRental(rentalId: string) : Observable<any> {
    return this.http.delete("api/v1/rentals/" + rentalId);
  }

  public getRentals() : Observable<any> {
    return this.http.get("api/v1/rentals");
  }

  public getRentalById(rentalId: string) : Observable<any> {
    return this.http.get("api/v1/rentals/" + rentalId);
  }

  public getUserRentals() : Observable<any> {
    return this.http.get("api/v1/rentals/manage");
  }

  public searchRentals(search: string) : Observable<any> {
    return this.http.get("api/v1/rentals?search=" + search);
  }

  public updateRental(rentalId: string, rental: any) : Observable<any> {
    return this.http.patch("api/v1/rentals/" + rentalId, rental);
  }

  public verifyRentalUser(rentalId: string) : Observable<any> {
    return this.http.get("api/v1/rentals/" + rentalId + "/verify-user");
  }
}