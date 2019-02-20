import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentService } from './shared/payment.service';
import { PaymentComponent } from './payment.component';

@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PaymentComponent
  ],
  providers: [
    PaymentService
  ]
})
export class PaymentModule { }