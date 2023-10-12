import {AfterViewInit, ChangeDetectorRef, ElementRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatTabsModule} from "@angular/material/tabs";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {
    SelectCategoryTypeComponent
} from "../../../../../UI-Elements/forms/select-category-type/select-category-type.component";
import {
    TypeaheadContactComponent
} from "../../../../../UI-Elements/forms/typeahead-contact/typeahead-contact.component";
import {TypeaheadVendorComponent} from "../../../../../UI-Elements/forms/typeahead-vendor/typeahead-vendor.component";
import {ActivatedRoute, Router} from "@angular/router";
import {BillService} from "../../../../../core/services/bill/bill.service";
import Bill from "../../../../../core/models/bill";
import {AppService} from "../../../../../core/services/app/app.service";
import {MatCardModule} from "@angular/material/card";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatDialog} from "@angular/material/dialog";
import {
    AppendItemModalComponent
} from "../../../../../UI-Elements/modals/append-item-modal/append-item-modal.component";
import {MatMenuModule} from "@angular/material/menu";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {PrintBillService} from "../../../../../core/services/print/printBill.service";
import {FuseDrawerComponent} from "../../../../../../@fuse/components/drawer";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import moment from "moment";
import {AccountingService} from "../../../../../core/services/Accounting/Accounting.service";
import {Subscription} from "rxjs";
import {ExpenseService} from "../../../../../core/services/bill/expense.service";
import {JsPrintService} from "../../../../../core/JsPrintService/JsPrintService.service";
import {SessionService} from "../../../../../core/services/session/session.service";
import {FirstNameService} from "../../../../../core/services/pipe/first-name.service";
import Invoice from "../../../../../core/models/invoice";
import {UtilityService} from "../../../../../core/services/utility/utility.service";
import {MatTableModule} from "@angular/material/table";
import {MatSidenavModule} from "@angular/material/sidenav";
import {ListHistoryComponent} from "../../../../../UI-Elements/tables/history/list-history/list-history.component";
import {AppModule} from "../../../../../app.module";
import {
    FileAttachmentComponent
} from "../../../../../UI-Elements/files/attachment/file-attachment/file-attachment.component";


@Component({
    selector: 'app-bill-detail',
    templateUrl: './bill-detail.component.html',
    styleUrls: ['./bill-detail.component.scss'],
    imports: [
        MatTabsModule,
        FormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        SelectCategoryTypeComponent,
        TypeaheadContactComponent,
        TypeaheadVendorComponent,
        MatCardModule,
        DatePipe,
        MatButtonModule,
        MatIconModule,
        NgForOf,
        NgSelectModule,
        MatMenuModule,
        FuseDrawerComponent,
        MatTooltipModule,
        MatSelectModule,
        CurrencyPipe,
        MatTableModule,
        MatSidenavModule,
        AppModule,
        FileAttachmentComponent,
        NgIf,
    ],
    standalone: true
})
export class BillDetailComponent implements OnInit, AfterViewInit {
    id: number
    billForm: FormGroup
    paymentFormGroup: FormGroup
    bill = new Bill()
    billed_at: Date
    bill_number: string
    contactPhone: number
    vendorPhone: number
    items: any
    accountItem: any
    paymentsMethode: any
    subscription = new Subscription();
    submitted: boolean = false
    facture: Invoice | Bill;
    billId: number
    billHistories: any


    displayedPaymentColumns = ['action', 'id', 'paid_at', 'description', 'amount', 'payment_method', 'account_id', 'user']
    Payments: any

    @ViewChild('settingsDrawer') settingsDrawer: FuseDrawerComponent

    constructor(
                private route: ActivatedRoute,
                private billService: BillService,
                private _formBuilder: FormBuilder,
                private appService: AppService,
                public dialog: MatDialog,
                private cd: ChangeDetectorRef,
                private printBillService: PrintBillService,
                private elementRef: ElementRef,
                private accountingService: AccountingService,
                private expenseService: ExpenseService,
                private jsPrintService: JsPrintService,
                private sessionService: SessionService,
                public utilityService: UtilityService,
                private router: Router

    ) {
    }


    ngAfterViewInit(): void {
        this.cd.detectChanges()
    }

    ngOnInit(): void {
        this.id = +this.route.snapshot.paramMap.get('id');
        this.initBillForm()
        this.initPaymentForm()
        this.getBill(this.id)

    }


    getDataVendor(event: any) {

    }

    getDataContact(event: any) {

    }

    getDataCategory(event: any) {

    }

    getBill(id: number) {
        this.billService.retreve(id).subscribe({
            next: (bill) => {
                console.log('bill :',bill.BillHistories)
                console.log(bill.id)
                this.billId = bill.id
                this.billHistories = bill.BillHistories ? bill.BillHistories : null
                this.bill = bill
                this.billed_at = new Date(bill.billed_at)
                this.bill_number = this.appService.getBillCode()
                this.contactPhone = bill.Contact ? bill.contact_phone : null
                this.vendorPhone = bill.Vendor ? bill.Vendor.phone : null

                setTimeout(() => {
                    this.billForm.patchValue(
                        Object.assign({}, bill, {
                            contact: bill.Contact ? bill.contact_name : null,
                            category: bill.Category.name,
                            vendor: bill.Vendor ? bill.Vendor.name : null,
                            due_at: new Date(bill.due_at),
                        })
                    );
                }, 1000);
                this.arrayToForm(bill.BillItems);
                this.Payments = this.bill.Payments
            },
            error: (err) => {
                console.log(err)
            }
        })
    }

    private initPaymentForm(){
        const cT = moment().toDate();

        this.paymentFormGroup = this._formBuilder.group(
            {
                paid_at: [
                    {value: cT, disabled: false}
                ],
                amount: null,
                account_id: null,
                payment_method: null,
                description: null
            }
        )
    }

    private arrayToForm(array: any): void {
        for (let i = 0; i < array.length; i++) {
            const item = Object.assign(
                {},
                {description: null},
                array[i],
                {item: array[i]},
                {Taxes: []}
            );

            this.BillItems.push(this._formBuilder.group(item));
        }
    }

    private initBillForm() {
        this.billForm = this._formBuilder.group(
            {
                category: [null, Validators.required],
                contact: null,
                vendor: null,
                currency_code: 'MGA',
                currency_rate: 1,
                billed_at: new Date(),
                due_at: new Date(),
                bill_number: null,
                order_number: null,
                notes: null,
                bill_status_code: 'draft',
                BillItems: this._formBuilder.array([]),
            }
        );
    }

    get BillItems(): FormArray {
        return this.billForm.get('BillItems') as FormArray;
    }


    openModal() {
        const dialogRef = this.dialog.open(AppendItemModalComponent, {
            width: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
            this.saveIndividualItem(result)
        });
    }

    resetForm() {
        this.bill = null;

        this.billForm.reset();
        while (this.BillItems.length) {
            this.BillItems.removeAt(0);
        }

        this.getBill(this.id);
    }

    private saveIndividualItem(item: any) {
        item = {
            ...item,
            bill_id: this.bill.id,
        };

        delete item.item;
        delete item.units;

        this.billService
            .addItem(this.bill.id, item)
            .toPromise()
            .then(() => {
                this.resetForm();
                // this.notification.success(null, 'SAVE_SUCCESS');
                console.log('save success')
            })
            .catch((err) => {
                // this.notification.error(null, err.error);
                console.log(err.error)
            });
    }

    removeItem(id: number, id_item: number) {
        this.billService
            .removeItem(this.bill.id, id_item)
            .toPromise()
            .then(() => {
                this.resetForm();
                // this.notification.success(null, 'UPDATE_SUCCESS');
                console.log('UPDATE_SUCCESS')
            })
            .catch((err) => {
                // this.notification.error(null, err.error)
                console.log(err)
            });
    }

    updateStatus() {
        this.billService
            .updateStatus(this.bill, {status: 'RECEIVED'})
            .toPromise()
            .then(() => {
                this.resetForm();
                // this.notification.success(null, 'UPDATE_SUCCESS');
                console.log('UPDATE_SUCCESS')
            })
            .catch((err) => {
                console.log(err)
            });
    }

    openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
        this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            enterAnimationDuration,
            exitAnimationDuration,
            data: {
                bill: this.bill,
            },
        });
    }

    sharedDataFacture(){
        // this.accountingService.facture.next(this.bill);
        this.paymentsMethode = this.appService.paymentMethods
        this.accountingService.getAccount().subscribe(
            (res)=>{
                this.accountItem = res
            }
        );
      this.onSubscribe()

    }

    addPayment(){
        this.submitted = true

        if (this.paymentFormGroup.valid) {
            console.log('valid passed')
            const formValue = this.paymentFormGroup.getRawValue();
            const body = Object.assign({}, formValue, {
                category_id: this.bill.category_id,
                currency_code: 'MGA',
                currency_rate: 1,
                contact_name: this.bill.Contact ? this.bill.Contact.name : this.bill.Vendor.name
            });
            console.log('body', body)
            if (this.facture instanceof Bill) {
                console.log('bill passed')
                body.bill_id = this.bill.id;
                body.type = 'BILL_PAYMENT';

                this.billService.createPayment(this.bill.id, body)
                    .toPromise()
                    .then(res => {
                        this.subscription.add(
                            this.expenseService.get(res.id).subscribe(payment => {
                                // this.notification.success(null, 'SAVE_SUCCESS');
                                console.log('save success')
                                this.settingsDrawer.close()
                                // this.close();

                                this.jsPrintService.printCashReceipt({
                                    id: payment.id,
                                    account_name: payment.Account.name,
                                    amount: payment.amount,
                                    category_name: payment.Category.name,
                                    contact_name: payment.Contact ? payment.Contact.name : payment.contact_name,
                                    description: payment.description,
                                    paid_at: moment(payment.paid_at).format('YYYY-MM-DD'),
                                    type: payment.amount < 0 ? 'CREDIT' : 'DEBIT',
                                    user_name: `${this.sessionService.getUser().name}.`
                                });
                                this.getBill(this.id)
                            })
                        );
                    })
                    .catch((err) => {
                            // this.notification.error(null, err.error);
                        console.log(err)
                        }
                    );
            }
        }
        else {
            // this.notification.error(null, 'FORM_NOT_VALID');
            console.log('form not valid')
        }
    }
    print(){
        this.printBillService.bill(this.bill)
    }

    onSubscribe(){
        const value = this.bill
        if (value) {
            let paymentDue;
            let totalPayment;
            let totalTax;
            let totalDiscount;

            if (value.hasOwnProperty('invoice_number') || value.hasOwnProperty('invoiced_at')) {
                this.facture = new Invoice(value);
                paymentDue = this.accountingService.getPaymentDue(this.facture.InvoiceItems);
                totalPayment = this.accountingService.getTotalPayment(this.facture.Revenues);
                totalTax = this.accountingService.getTotalTax(this.facture.InvoiceItems);
                totalDiscount = this.accountingService.getTotalDiscount(this.facture.InvoiceItems);
            }
            else {
                this.facture = new Bill(value);
                console.log('fature',this.facture)
                paymentDue = this.accountingService.getPaymentDue(this.facture.BillItems);
                totalPayment = this.accountingService.getTotalPayment(this.facture.Payments);
                totalTax = this.accountingService.getTotalTax(this.facture.BillItems);
                totalDiscount = this.accountingService.getTotalDiscount(this.facture.BillItems);
            }

            const accountId = this.sessionService.getUserExtra('account_id');

            this.paymentFormGroup.patchValue({
                account_id: accountId,
                amount: paymentDue + totalTax - totalDiscount - totalPayment
            });
        }
    }

    close(){
      const cT = moment().toDate();

      this.submitted = false;
      this.paymentFormGroup.reset({
        paid_at: {value: cT, disabled: true}
      });
    }

    refund(){
        this.onSubscribe()
        this.paymentsMethode = this.appService.paymentMethods
        this.accountingService.getAccount().subscribe(
          (res)=>{
              this.accountItem = res
          }
        );
        this.Payments.forEach(objet => {
            this.paymentFormGroup.patchValue(
              {
                  paid_at: objet.paid_at,
                  amount: objet.amount * -1,
                  payment_method: objet.payment_method,
                  account_id: objet.account_id
              }
            )
        });
    }

    reset(){
        this.bill = null
        this.submitted = false
        this.getBill(this.id)
    }

    deleteAttachment(docId: string) {
        this.billService.deleteAttachment(this.bill.id, docId)
          .then(() => {
              this.resetForm();
              // this.notification.success(null, 'DELETE_SUCCESS');
              console.log('DELETE_SUCCESS')
          })
          .catch(err => {
              // this.notification.error(null, err.message)
              console.log(err)
          });
    }

}
