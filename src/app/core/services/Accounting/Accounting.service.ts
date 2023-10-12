import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import Bill, {BillItem} from "../../models/bill";
import Invoice, {InvoiceItem} from "../../models/invoice";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {FormGroup} from "@angular/forms";
import Revenue from "../../models/revenue";
import BillPayment from "../../models/bill-payment";
import {AppService} from "../app/app.service";
import _sumBy from 'lodash.sumby';
import _forEach from 'lodash.foreach';


@Injectable({
    providedIn: "root"
})
export class AccountingService{
    private $invoice = new Subject<Invoice | Bill>();

    constructor(private http: HttpClient) {
    }

    get facture() {
        return this.$invoice;
    }

    getAccount(){
        const url = [AppService.API, 'accounts'].join('/')
        return this.http.get<any>(url)
    }
    getPaymentDue(items: InvoiceItem[] | BillItem[], item_type?: 'BUS_SEAT' | 'SERVICES'): number {
        return _sumBy(items, item => {
            if (item_type) {
                return (item_type === item.item_type) ? (item.quantity * item.price) : 0;
            }
            else return item.quantity * item.price;
        });
    }

  getItemTotal = (formGroup: FormGroup) => {
    const total = formGroup.controls.quantity.value * formGroup.controls.price.value;

    formGroup.patchValue({total: total});

    return total;
  }

  getTotalPayment(payments: Revenue[] | BillPayment[]): number {
    return _sumBy(payments, (revenu) => {
      if (revenu.payment_method === 'SP') return 0;
      else if (revenu.currency_code === AppService.DEFAULT_CURRENCY) return revenu.amount;
      else return revenu.amount / (revenu.currency_rate || 1);
    });
  }

  getTotalTax(items: Array<InvoiceItem>): number {
    return _sumBy(items, item => {
      return _sumBy(item.Taxes, (tax) => {
        if (tax.type === 'FIXED') {
          return item.quantity * tax.rate;
        }
        else if (tax.type !== 'DISCOUNT' && tax.type !== 'OTHER') {
          return (item.price * item.quantity) * tax.rate / 100;
        }
        else {
          return 0;
        }
      });
    });
  }

  getTotalDiscount(items: Array<InvoiceItem>): number {
    let amount = 0;

    _forEach(items, (item) => {
      amount += _sumBy(item.Taxes, (tax) => {
        if (tax.type === 'DISCOUNT') {
          return (item.price * item.quantity) * tax.rate / 100;
        } else {
          return 0;
        }
      });
    });

    return amount;
  }
}
