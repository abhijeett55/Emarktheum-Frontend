import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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
  //comment is the original this is for testing
//   login(username: string, password: string) {

//   console.log("Fake login request:", username, password);

//   return of({
//     id: 1,
//     username: username,
//     email: "test@test.com",
//     roles: ["ROLE_USER"],
//     accessToken: "fake-jwt-token"
//   });

// }


//   register(username: string,email: string ,password: string): Observable<any> {

//   console.log("Fake register:", username, email, password);

//   return of({
//     message: "User registered successfully"
//   });
// }
// }
