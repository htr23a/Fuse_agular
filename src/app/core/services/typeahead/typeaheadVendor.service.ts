import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class TypeaheadVendorService {
    constructor(private httpClient: HttpClient) {
    }

    get(value: string): Observable<any>{

        const url = `${environment.apiGrv}/vendors/${value}/select`
        return this.httpClient.get<any>(url);

    }
}
