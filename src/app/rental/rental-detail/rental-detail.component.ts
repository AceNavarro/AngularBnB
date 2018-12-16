import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';

@Component({
  selector: 'bnb-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent implements OnInit {

  rental: Rental;

  constructor(private route: ActivatedRoute,
              private rentalService: RentalService) {

   }

  ngOnInit() {
    const rentalId: string = this.route.snapshot.paramMap.get("rentalId");
    this.rentalService.getRentalById(rentalId)
        .subscribe(rental => this.rental = rental,
                   err => console.error(err));
  }
}
