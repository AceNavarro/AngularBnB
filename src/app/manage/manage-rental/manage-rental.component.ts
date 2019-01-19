import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { RentalService } from 'src/app/rental/shared/rental.service';
import { Rental } from 'src/app/rental/shared/rental.model';


@Component({
  selector: 'bnb-manage-rental',
  templateUrl: './manage-rental.component.html',
  styleUrls: ['./manage-rental.component.scss']
})
export class ManageRentalComponent implements OnInit {

  faTrashAlt = faTrashAlt;
  rentals: Rental[];
  rentalDeleteIndex: number;

  constructor(private rentalService: RentalService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.rentalService.getUserRentals().subscribe(
      result => this.rentals = result,
      err => console.error(err)
    );
  }

  deleteRental() {
    const rentalId = this.rentals[this.rentalDeleteIndex]._id;
    this.rentalService.deleteRental(rentalId).subscribe(
      result => {
        this.rentals.splice(this.rentalDeleteIndex, 1);
        this.rentalDeleteIndex = undefined;
      }, (err: HttpErrorResponse) => {
        this.toastr.error(err.error.errors[0].detail, "Error!")
      }
    );
  }

}
