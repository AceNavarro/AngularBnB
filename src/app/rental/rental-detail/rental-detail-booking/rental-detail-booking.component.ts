import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DaterangePickerComponent } from 'ng2-daterangepicker';

import { BookingService } from 'src/app/booking/shared/booking.service';
import { HelperService } from 'src/app/common/service/helper.service';
import { Booking } from 'src/app/booking/shared/booking.model';
import { Rental } from '../../shared/rental.model';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'bnb-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {

  @Input() rental: Rental;

  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  authService: AuthService;
  bookedOutDates: string[] = [];
  errors: any[] = [];
  newBooking: Booking;
  modalRef: NgbModalRef;

  options: any = {
    locale: { format: Booking.DATE_FORMAT },
    autoApply: true,
    // set to False so that the textbox is initially empty
    autoUpdateInput: false,
    alwaysShowCalendars: false,
    opens: 'left',
    isInvalidDate: this.isInvalidDate.bind(this)
  };

  constructor(private auth: AuthService,
              private bookingService: BookingService,
              private helperService: HelperService,
              private modalService: NgbModal,
              private toastr: ToastrService) { 
    this.authService = auth;
  }

  ngOnInit() {
    this.initBooking();
    this.initBookedOutDates();
  }

  private blockBookingDates(startAt: string, endAt: string) {
    const range = this.helperService.getBookingRangeOfDates(startAt, endAt);
    this.bookedOutDates.push(...range);
  }

  private initBooking() {
    this.newBooking = new Booking();
    this.newBooking.rental = this.rental;
  }

  private initBookedOutDates() {
    const bookings: Booking[] = this.rental.bookings;

    if (bookings && bookings.length > 0) {
      const today = moment();
      bookings.forEach(booking => {
        // Consider only bookings that are still in the future
        if (moment(booking.endAt).diff(today) > 0) {
          this.blockBookingDates(booking.startAt, booking.endAt);
        }
      });
    }
  }

  private isInvalidDate(date: moment.Moment) {
    const formattedDate = this.helperService.FormatBookingDate(date);
           //  Date is invalid if it belongs to an existing booking
    return this.bookedOutDates.includes(formattedDate) || 
           //  Date is invalid if it is a past date
           date.diff(moment(), "days") < 0;
  }

  private resetDatePicker() {
    const today: moment.Moment = moment();
    this.picker.datePicker.setStartDate(today);
    this.picker.datePicker.setEndDate(today);
    this.picker.datePicker.element.val("");
  }

  openConfirmModal(content) {
    this.errors = [];
    this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  reserveRental() {
    this.bookingService.createBooking(this.newBooking).subscribe(
      result => {
        this.blockBookingDates(result.startAt, result.endAt);
        this.initBooking();
        this.resetDatePicker();
        this.modalRef.close();
        this.toastr.success("Booking has been successfully created. Check your booking detail in manage section.", "Success!");
      }, err => {
        console.log(err);
        this.errors = err.error.errors;
      }
    )
  }

  selectedDate(value: any) {
    // set to True so that textbox will be updated automatically
    this.options.autoUpdateInput = true;

    // update the new booking details
    this.newBooking.startAt = this.helperService.FormatBookingDate(value.start);
    this.newBooking.endAt = this.helperService.FormatBookingDate(value.end);
    this.newBooking.days = value.end.diff(value.start, "days");
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
  }

}
