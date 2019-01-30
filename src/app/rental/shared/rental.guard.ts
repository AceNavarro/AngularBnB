import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { RentalService } from './rental.service';
import { Observable, of} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RentalGuard implements CanActivate {

  constructor(private rentalService: RentalService, 
              private router: Router,
              private toastr: ToastrService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const rentalId: string = route.params.rentalId;
    return this.rentalService.verifyRentalUser(rentalId).pipe(
      map(() => {
        return true;
      }), catchError((err: HttpErrorResponse) => {
        this.router.navigate(["/rentals/" + rentalId]);
        this.toastr.error(err.error.errors[0].detail, "Error!");
        return of(false);
      }));
  }

}
