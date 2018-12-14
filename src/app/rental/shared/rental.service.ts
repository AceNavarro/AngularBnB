import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Rental } from './rental.model';

@Injectable()
export class RentalService {

  private rentals: Rental[] = [
    {
      id: "1",
      title: "Central Apartment",
      city: "Vancouver",
      street: "Burrard Street",
      category: "Apartment",
      image: "http://via.placeholder.com/350x250",
      bedrooms: 3,
      description: "Pellentesque consequat orci sed tincidunt blandit. Fusce dapibus mauris a placerat laoreet. Suspendisse at vulputate arcu. In elementum dolor a diam dictum posuere. Maecenas ut faucibus dolor, ac faucibus metus. Donec vehicula pellentesque urna a ullamcorper. Proin cursus tortor nulla, congue imperdiet dui feugiat eu. Ut elit ipsum, sagittis nec.",
      dailyRate: 34,
      shared: false,
      createdAt: "19/9/2018"
    },
    {
      id: "2",
      title: "North Apartment",
      city: "Prince Rupert",
      street: "Pender Street",
      category: "Apartment",
      image: "http://via.placeholder.com/350x250",
      bedrooms: 2,
      description: "Pellentesque consequat orci sed tincidunt blandit. Fusce dapibus mauris a placerat laoreet. Suspendisse at vulputate arcu. In elementum dolor a diam dictum posuere. Maecenas ut faucibus dolor, ac faucibus metus. Donec vehicula pellentesque urna a ullamcorper. Proin cursus tortor nulla, congue imperdiet dui feugiat eu. Ut elit ipsum, sagittis nec.",
      dailyRate: 21,
      shared: false,
      createdAt: "19/9/2018"
    },
    {
      id: "3",
      title: "West Apartment",
      city: "Richmond",
      street: "Robson Street",
      category: "Apartment",
      image: "http://via.placeholder.com/350x250",
      bedrooms: 6,
      description: "Pellentesque consequat orci sed tincidunt blandit. Fusce dapibus mauris a placerat laoreet. Suspendisse at vulputate arcu. In elementum dolor a diam dictum posuere. Maecenas ut faucibus dolor, ac faucibus metus. Donec vehicula pellentesque urna a ullamcorper. Proin cursus tortor nulla, congue imperdiet dui feugiat eu. Ut elit ipsum, sagittis nec.",
      dailyRate: 15,
      shared: true,
      createdAt: "19/9/2018"
    },
    {
      id: "4",
      title: "East Apartment",
      city: "Burnaby",
      street: "Hastings Street",
      category: "Apartment",
      image: "http://via.placeholder.com/350x250",
      bedrooms: 4,
      description: "Pellentesque consequat orci sed tincidunt blandit. Fusce dapibus mauris a placerat laoreet. Suspendisse at vulputate arcu. In elementum dolor a diam dictum posuere. Maecenas ut faucibus dolor, ac faucibus metus. Donec vehicula pellentesque urna a ullamcorper. Proin cursus tortor nulla, congue imperdiet dui feugiat eu. Ut elit ipsum, sagittis nec.",
      dailyRate: 45,
      shared: false,
      createdAt: "19/9/2018"
    }
  ];

  public getRentals() : Observable<Rental[]> {
    return of(this.rentals);
  }

  public getRentalById(rentalId: string) : Observable<Rental> {
    return of(this.rentals.find(rental => rental.id === rentalId));
  }

}