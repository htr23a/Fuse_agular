import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {AppService} from "../app/app.service";

@Injectable({
    providedIn: 'root'
})
export class TypeaheadContactService{
    constructor(private httpClient: HttpClient) {
    }

    get(value: string): Observable<any>{

        const url = `${AppService.API}/contacts/${value}/select`
        return this.httpClient.get<any>(url);

    }
}
