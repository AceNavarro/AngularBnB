import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Booking } from 'src/app/booking/shared/booking.model';

@Component({
  selector: 'bnb-manage-rental-booking',
  templateUrl: './manage-rental-booking.component.html',
  styleUrls: ['./manage-rental-booking.component.scss']
})
export class ManageRentalBookingComponent implements OnInit {

  @Input() bookings: Booking[];
  modalService: NgbModal;

  constructor(private modal: NgbModal) {
    this.modalService = modal;
  }

  ngOnInit() {
  }

}
