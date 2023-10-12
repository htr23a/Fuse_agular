import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TableState} from "../../models/tableState";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import Bill from "../../models/bill";
import BillPayment from "../../models/bill-payment";
import {AppService} from "../app/app.service";

@Injectable({
    providedIn: 'root'
})
export class BillService{
    constructor(private http: HttpClient) {
    }

    paginate(tableState: TableState): Observable<any>{
        const url = [AppService.API, 'bills', 'paginate'].join('/')
        return this.http.post<any>(url, tableState)
    }

    draft(date: any): Observable<any>{
        const url = [AppService.API, 'bills', 'draft'].join('/')
        return this.http.post<any>(url, date)
    }

    retreve(id: number){
        const url = `${AppService.API}/bills/${id}`
        return this.http.get<any>(url)
    }

    addItem(id: number, body: any): Observable<any> {
        const url = [AppService.API, 'bills', id, 'item/unit'].join('/');
        return this.http.post<any>(url, body).pipe(
            catchError(err => {
                if (err.error && typeof err.error.message === 'string') {
                    if (err.error.message.includes('nonnegative_tri_inventories_quantity')) {
                        err.error.message = 'STOCK_NOT_ENOUGH';
                    }
                }
                return throwError(err);
            })
        );
    }

    removeItem(id: number, item_id: number): Observable<any> {
        const url = [AppService.API, 'bills', id, 'item', item_id, 'unit'].join('/');
        return this.http.delete<any>(url);
    }

    updateStatus(bill: Bill, params): Observable<any> {
        const url = [AppService.API, 'bills', bill.id, 'status'].join('/');
        return this.http.post<any>(url, params);
    }

    cancelWithUnit(bill: Bill): Observable<Bill> {
        const url = [AppService.API, 'bills', bill.id, 'unit'].join('/');
        return this.http.delete<Bill>(url);
    }

    createPayment(bill_id, payment: BillPayment): Observable<BillPayment> {
        const url = [AppService.API, 'bills', bill_id, 'payment'].join('/');
        return this.http.post<BillPayment>(url, payment);
    }

    addHistory(params): Observable<any> {
        const url = [AppService.API, 'bills', params['id'], 'note'].join('/');
        return this.http.post<any>(url, params);
    }

    deleteAttachment(id: any, docId: any): Promise<any> {
        const url = [AppService.API, 'bills', id, 'attachment', docId].join('/');
        return this.http.delete<any>(url).toPromise();
    }

    search(id): Observable<any> {
        const url = [AppService.API, 'bills', id, 'search'].join('/');
        return this.http.get<any>(url);
    }
}
