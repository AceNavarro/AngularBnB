import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bnb-rental-list-item',
  templateUrl: './rental-list-item.component.html',
  styleUrls: ['./rental-list-item.component.scss']
})
export class RentalListItemComponent implements OnInit {

  @Input() rental: any;

  constructor() { }

  ngOnInit() {
  }

}
