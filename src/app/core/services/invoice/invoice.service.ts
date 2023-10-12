import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AppService} from "../app/app.service";

@Injectable({
    providedIn: 'root'
})
export class InvoiceService{
    constructor(private httpClient: HttpClient) {
    }
    addHistory(params): Observable<any> {
        const url = [AppService.API, 'invoices', params['id'], 'note'].join('/');
        return this.httpClient.post<any>(url, params);
    }
}
