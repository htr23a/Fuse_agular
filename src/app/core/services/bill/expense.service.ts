import {Injectable} from "@angular/core";
import {catchError, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TableState} from "../../models/tableState";
import Bill from "../../models/bill";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    constructor(private httpClient: HttpClient) {
    }
    paginate(tableState: TableState): Observable<any> {

        const url = [environment.apiPas,'expenses','paginate'].join('/');
        return this.httpClient.post<any>(url, tableState);
    }

    select(item: string): Observable<any>{
        const url = `${environment.apiPas}/contacts/${item}/select`;
        return this.httpClient.get<any>(url)
    }

    categoryExpense(type: string){
        const url = `${environment.apiPas}/categories?type=${type}`;
        return this.httpClient.get<any>(url)
    }

    createWithUnit(bill: Bill): Promise<Bill> {
        const url = [environment.apiGrv, 'bills/units'].join('/');
        return this.httpClient.post<Bill>(url,bill).pipe(
            catchError(err => {
                if (err.error && typeof err.error.message === 'string') {
                    if (err.error.message.includes('nonnegative_tri_inventories_quantity')) {
                        err.error.message = 'STOCK_NOT_ENOUGH';
                    }
                }
                return throwError(err);
            })
        ).toPromise()
    }

}

