import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SelectCategoryTypeService {
    constructor(private httpClient: HttpClient) {
    }

    get(type: string): Observable<any>{

        const url = `${environment.apiGrv}/categories?type=${type}`
        return this.httpClient.get<any>(url);

    }
}
