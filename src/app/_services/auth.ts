import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
  headers : new HttpHeaders( {'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root',
})


export class Auth {
  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string) : Observable<any> {
    return this.httpClient.post( AUTH_API + 'signin',{
      username,
      password
    }, httpOptions
    );
  }

  register(username: string,email: string ,password: string): Observable<any> {
    return this.httpClient.post(AUTH_API + 'register',{
      username,
      email,
      password
    }, httpOptions);
  }
}
