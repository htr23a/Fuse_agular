import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import Tax from "../../models/tax";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class TaxService{
    constructor(private http: HttpClient) {
    }
    list(params?: any): Observable<Tax[]> {

        const url = [environment.apiGrv, 'taxes'].join('/');
        return this.http.get<Tax[]>(url, {params: params});
    }
}
