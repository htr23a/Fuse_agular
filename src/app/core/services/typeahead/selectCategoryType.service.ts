import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {AppService} from "../app/app.service";

@Injectable({
    providedIn: 'root'
})
export class SelectCategoryTypeService {
    constructor(private httpClient: HttpClient) {
    }

    get(type: string): Observable<any>{

        const url = `${AppService.API}/categories?type=${type}`
        return this.httpClient.get<any>(url);

    }
}
