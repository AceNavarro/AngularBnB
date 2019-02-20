import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'bnb-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {

  stripe: any;
  elements: any;

  // Create references to the DOM elements
  @ViewChild("cardNumber") cardNumberRef: ElementRef;
  @ViewChild("cardExp") cardExpRef: ElementRef;
  @ViewChild("cardCvc") cardCvcRef: ElementRef;

  @Output() paymentConfirmed = new EventEmitter();

  cardNumberElement: any;
  cardExpElement: any;
  cardCvcElement: any;

  token: any;
  isValidatingCard: boolean = false;
  error: string = "";

  constructor() {
    this.stripe = Stripe(environment.STRIPE_PK);
    this.elements = this.stripe.elements();

    // Apply binding to onChange method
    this.onChange = this.onChange.bind(this);
   }

  ngOnInit() {
    // Create elements and mount to DOM
    this.cardNumberElement = this.elements.create("cardNumber", {style});
    this.cardNumberElement.mount(this.cardNumberRef.nativeElement);

    this.cardExpElement = this.elements.create("cardExpiry", {style});
    this.cardExpElement.mount(this.cardExpRef.nativeElement);

    this.cardCvcElement = this.elements.create("cardCvc", {style});
    this.cardCvcElement.mount(this.cardCvcRef.nativeElement);

    // Add event listener to elements
    this.cardNumberElement.addEventListener("change", this.onChange);
    this.cardExpElement.addEventListener("change", this.onChange);
    this.cardCvcElement.addEventListener("change", this.onChange);
  }

  ngOnDestroy() {
    // Remove event listener to elements
    this.cardNumberElement.removeEventListener("change", this.onChange);
    this.cardExpElement.removeEventListener("change", this.onChange);
    this.cardCvcElement.removeEventListener("change", this.onChange);

    // Destroy elements
    this.cardNumberElement.destroy();
    this.cardExpElement.destroy();
    this.cardCvcElement.destroy();
  }

  onChange({error}) {
    // Clear token when changes were made to card details. User must verify again.
    this.token = undefined;
    this.paymentConfirmed.emit(undefined);

    if (error) {
      this.error = error.message;
    } else {
      this.error = "";
    }
  }

  async onSubmit() {
    this.token = undefined;
    this.isValidatingCard = true;
    const result = await this.stripe.createToken(this.cardNumberElement);
    this.isValidatingCard = false;

    if (result.error) {
      this.error = result.error.message;
      this.paymentConfirmed.emit(undefined);
    } else {
      this.token = result.token;
      this.paymentConfirmed.emit(result.token);
    }
  }

  isCardValid(): boolean {
    return this.cardNumberElement._complete && this.cardExpElement._complete && this.cardCvcElement._complete;
  }

}


// Style for stripe elements
const style = {
  base: {
    iconColor: '#666EE8',
    color: '#31325F',
    // lineHeight: '40px',
    fontWeight: 300,
    fontFamily: 'Helvetica Neue',
    fontSize: '15px',

    '::placeholder': {
      color: '#CFD7E0',
    },
  },
};
