import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: "bnb-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})

export class HeaderComponent {

  constructor(public auth: AuthService,
              private router: Router) { }

  logout() {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }

  search(keywords: string) {
    if (keywords) {
      this.router.navigate([`/rentals/${keywords}/homes`]);
    } else {
      this.router.navigate(["/rentals"]);
    }
  }

}