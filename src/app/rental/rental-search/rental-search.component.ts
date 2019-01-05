import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';

@Component({
  selector: 'bnb-rental-search',
  templateUrl: './rental-search.component.html',
  styleUrls: ['./rental-search.component.scss']
})
export class RentalSearchComponent implements OnInit {

  rentals: Rental[] = [];
  errors: string[] = [];
  search: string;

  constructor(private activatedRoute: ActivatedRoute,
              private rentalService: RentalService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      params => {
        this.search = params["search"];
        console.log(this.search);
        this.searchRentals();
      });
  }

  private searchRentals() {
    this.errors = [];
    this.rentals = [];

    this.rentalService.searchRentals(this.search)
        .subscribe(rentals => this.rentals = rentals,
                   err => this.errors = err.error.errors);
  }
}
