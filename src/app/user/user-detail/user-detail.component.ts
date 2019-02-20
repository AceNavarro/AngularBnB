import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../shared/user.service';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'bnb-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  @Input() user: any;

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUser(this.authService.getUserId()).subscribe(
      (result: any) => this.user = result,
      (err) => console.error(err)
    );
  }

  resetUser() {
    this.getUser();
  }

  saveUser() {
    this.userService.updateUser(this.authService.getUserId(), this.user).subscribe(
      (result: any) => { 
        this.authService.logout();
        this.router.navigate(["/login"]);
      }, (err) => console.error(err)
    );
  }

}
