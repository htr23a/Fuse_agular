import {Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpParams,
    HttpRequest
} from '@angular/common/http';
import {Observable} from 'rxjs/index';


import {environment} from "../../../environments/environment";
import {SessionService} from "../services/session/session.service";
import {AuthentificationService} from "../services/authentification/authentification.service";
import {AppService} from "../services/app/app.service";
import {catchError, throwError} from "rxjs";
/*import {AppService} from '../app.service';*/

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthentificationService,
        private sessionService: SessionService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const token = this.sessionService.getToken();

        if (token) {
            request = request.clone({
                setHeaders: {
                    'x-access-token': `${token}`,
                    // version: environment.version // todo check version
                }
            });
        }

        const API = 'https://api.capsule.mg/pascoma';
        const URL = request.url;

        if ((!token && !URL.startsWith(API + '/login')) || !API) this.authService.logout();

        return next.handle(request);

    }
}
