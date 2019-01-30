import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UcWordsPipe } from 'ngx-pipes';

import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';

@Component({
  selector: 'bnb-rental-update',
  templateUrl: './rental-update.component.html',
  styleUrls: ['./rental-update.component.scss']
})
export class RentalUpdateComponent implements OnInit {

  rental: Rental;
  rentalCategories: any[] = Rental.CATEGORIES;
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private rentalService: RentalService,
              private toastr: ToastrService,
              private ucWordsPipe: UcWordsPipe) {
    this.transformLocation = this.transformLocation.bind(this);
  }

  ngOnInit() {
    const rentalId: string = this.route.snapshot.paramMap.get("rentalId");
    this.getRental(rentalId);
  }

  countBedroomAssets(assetNum: number): number {
    // During editing mode, the value of rental.bedrooms becomes string so casting is needed.
    return parseInt(<any>this.rental.bedrooms || 0) + assetNum;
  }

  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId)
        .subscribe(rental => this.rental = rental,
                   err => console.error(err));
  }

  transformLocation(location: string): string {
    return this.ucWordsPipe.transform(location);
  }

  updateRental(rentalId: string, rentalData: any) {
    this.rentalService.updateRental(rentalId, rentalData)
      .subscribe(rental => { 
        this.rental = rental;
        if (rentalData.city || rentalData.street) {
          this.locationSubject.next(rental.street + ", " + rental.city);
        }
      }, (err: HttpErrorResponse) => {
        this.getRental(rentalId);
        this.toastr.error(err.error.errors[0].detail, "Error!");
      });
  }

}
