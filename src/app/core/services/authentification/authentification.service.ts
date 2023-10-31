import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, Observable, of, switchMap} from "rxjs";
import {AuthUtils} from "../../auth/auth.utils";
import {UserService} from "../../user/user.service";
import {environment} from "../../../../environments/environment";
import {AppService} from "../app/app.service";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private _authenticated: boolean = false;

  constructor(private httpClient: HttpClient,
              private _httpClient: HttpClient,
              private router: Router,
              private _userService: UserService,) {
  }

  login(email: string, password: string) {
    this._authenticated = true;
    return this.httpClient.post<any>([AppService.API, 'login'].join('/'), {
      email: email,
      password: password,
    });
  }

  set accessToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  get accessToken(): string {
    return sessionStorage.getItem('token') ?? '';
  }

  set Settings(settings: any){
      sessionStorage.setItem('TS_COMPANY_SETTINGS', settings);
  }

  get Settings(){
      return sessionStorage.getItem('TS_COMPANY_SETTINGS') ?? '';
  }

  logout() {
      console.log('log Out')
      this.router.navigate(['/sign-out'])
        sessionStorage.clear();
        this._authenticated = false;
  }

  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }
    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    // if (AuthUtils.isTokenExpired(this.accessToken)) {
    //   return of(false);
    // }

    // If the access token exists, and it didn't expire, sign in using it
    return this.signInUsingToken();
  }

  signInUsingToken(): Observable<any> {
    // Sign in using the token

    return of (true)
  }

    getSettings(id: number, fields?: any[]) {
        const authToken = sessionStorage.getItem('token')
        const headers = new HttpHeaders({
            'Content-type': 'application/json',
            'x-access-token': authToken
        })

        const url = [AppService.API, 'companies', id, 'settings'].join('/');

        if (fields) {
            return this._httpClient.post<any>(url, { fields }, {headers: headers});
        }
        else {
            return this._httpClient.get<any>(url,{headers: headers});
        }
    }
}
