import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';

class DecodedToken {
  exp: number = 0;
  username: string = "";
  userId: string = "";
}

@Injectable()
export class AuthService {

  private decodedToken: DecodedToken;

  constructor(private http: HttpClient) { 
    this.decodedToken = this.getDecodedToken(); 
  }

  private getDecodedToken(): DecodedToken {
    return JSON.parse(localStorage.getItem("bnb_meta")) || new DecodedToken();
  }

  private saveToken(token: string): string {
    const jwt = new JwtHelperService();
    this.decodedToken = jwt.decodeToken(token);

    localStorage.setItem("bnb_auth", token);
    localStorage.setItem("bnb_meta", JSON.stringify(this.decodedToken));
    return token;
  }

  private getExpiration(): any {
    return moment.unix(this.decodedToken.exp);
  }

  public login(formData: any) : Observable<any> {
    return this.http.post("/api/v1/users/auth", formData).pipe(map(
      (token: string) => { this.saveToken(token) }));
  }

  public logout() {
    localStorage.removeItem("bnb_auth");
    localStorage.removeItem("bnb_meta");
    this.decodedToken = new DecodedToken;
  }

  public register(formData: any) : Observable<any> {
    return this.http.post("/api/v1/users/register", formData);
  }

  public isAuthenticated(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  public getAuthToken(): string {
    return localStorage.getItem("bnb_auth");
  }

  public getUsername(): string {
    return this.decodedToken.username;
  }

  public getUserId(): string {
    return this.decodedToken.userId;
  }

}