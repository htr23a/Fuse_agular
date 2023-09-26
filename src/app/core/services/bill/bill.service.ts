import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TableState} from "../../models/tableState";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class BillService{
    constructor(private http: HttpClient) {
    }

    paginate(tableState: TableState): Observable<any>{
        const url = [environment.apiGrv, 'bills', 'paginate'].join('/')
        return this.http.post<any>(url, tableState)
    }

    draft(date: any): Observable<any>{
        const url = [environment.apiGrv, 'bills', 'draft'].join('/')
        return this.http.post<any>(url, date)
    }
}
