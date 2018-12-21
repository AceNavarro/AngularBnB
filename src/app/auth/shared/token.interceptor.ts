import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { AuthService } from "./auth.service"

@Injectable()  
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken: string = this.authService.getAuthToken();

    if (authToken) {
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      const authReq = req.clone({
        setHeaders: {
          Authorization: "Bearer " + authToken
        }
      });
      // send cloned request with header to the next handler.
      return next.handle(authReq);
    }

    // send original request
    return next.handle(req);
  }
}