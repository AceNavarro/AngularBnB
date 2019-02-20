import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  public getUser(userId: string) : Observable<any> {
    return this.http.get("api/v1/users/" + userId);
  }

  public updateUser(userId: string, userData: any) : Observable<any> {
    return this.http.patch("api/v1/users/" + userId, userData);
  }

}
