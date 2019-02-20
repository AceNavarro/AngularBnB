import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AuthGuard } from '../auth/shared/auth.guard';
import { AuthService } from '../auth/shared/auth.service';
import { UserService } from './shared/user.service';

import { UserComponent } from './user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Routes = [
  { 
    path: "users", 
    component: UserComponent,
    children: [
      { path: "", redirectTo: "/rentals", pathMatch: "full" },
      { path: "profile", component: UserDetailComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  declarations: [
    UserComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    UserService,
    AuthService
  ]
})
export class UserModule { }
