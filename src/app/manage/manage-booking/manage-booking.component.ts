import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { BookingService } from 'src/app/booking/shared/booking.service';
import { PaymentService } from 'src/app/payment/shared/payment.service';

import { Booking } from 'src/app/booking/shared/booking.model';

@Component({
  selector: 'bnb-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss']
})
export class ManageBookingComponent implements OnInit {

  bookings: Booking[];
  payments: any[];

  constructor(private bookingService: BookingService,
              private paymentService: PaymentService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.getUserBookings();
    this.getPendingPayments();
  }

  getUserBookings() {
    this.bookingService.getUserBookings().subscribe(
      result => this.bookings = result,
      err => console.error(err)
    );
  }

  getPendingPayments() {
    this.paymentService.getPendingPayments().subscribe(
      (result: any) => this.payments = result,
      err => console.error(err)
    );
  }

  acceptPayment(payment: any) {
    this.paymentService.acceptPayment(payment).subscribe(
      () => {
        this.getPendingPayments();
        this.toastr.success("Booking payment was accepted.", "Success!");
      }, (err: HttpErrorResponse) => this.toastr.error(err.error.errors[0].detail, "Error!")
    );
  }

  declinePayment(payment: any) {
    this.paymentService.declinePayment(payment).subscribe(
      () => {
        this.getPendingPayments();
        this.toastr.success("Booking payment was declined.", "Success!")
      }, (err: HttpErrorResponse) => this.toastr.error(err.error.errors[0].detail, "Error!")
    );
  }

}
