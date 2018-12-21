import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'bnb-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formData: any = {};
  errors: any[] = [];

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.formData).subscribe(
      async result => {
        await this.router.navigate(["/login", { register: "success" }]);
      }, err => {
        this.errors = err.error.errors;
      });
  }

}
