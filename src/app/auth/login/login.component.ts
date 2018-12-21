import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bnb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errors: any[] = [];
  message: string = "";

  constructor(private authService: AuthService, 
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();

    this.route.params.subscribe(params => {
      if (params["register"] === "success") {
        this.message = "You have been successfully registered. You can now login!";
      }
    });
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ["", [
        Validators.required,
        Validators.pattern("^[\\w]{1,}[\\w.+-]{0,}@[\\w-]{1,}([.][a-zA-Z]{1,}|[.][\\w-]{2,}[.][a-zA-Z]{1,})$")
      ]],
      password: ["", Validators.required]
    });
  }

  isInvalidInput(name: string): boolean {
    const input = this.loginForm.get(name);
    return input.invalid && (input.dirty || input.touched);
  }

  getInputErrors(name: string): any {
    return this.loginForm.get(name).errors;
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      async result => {
        await this.router.navigate(["/rentals", { login: "success" }]);
      }, err => {
        this.errors = err.error.errors;
      })
  }

}
