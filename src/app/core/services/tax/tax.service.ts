import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import Tax from "../../models/tax";
import {environment} from "../../../../environments/environment";
import {AppService} from "../app/app.service";

@Injectable({
    providedIn: 'root'
})
export class TaxService{
    constructor(private http: HttpClient) {
    }
    list(params?: any): Observable<Tax[]> {

        const url = [AppService.API, 'taxes'].join('/');
        return this.http.get<Tax[]>(url, {params: params});
    }
}
