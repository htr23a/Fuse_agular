import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import _orderBy from 'lodash.orderby';
import {MaintenanceService} from "../../../../core/services/maintenance/maintenance.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InvoiceService} from "../../../../core/services/invoice/invoice.service";
import {BillService} from "../../../../core/services/bill/bill.service";
import {tap} from "rxjs";

@Component({
  selector: 'app-list-history',
  templateUrl: './list-history.component.html',
  styleUrls: ['./list-history.component.scss']
})
export class ListHistoryComponent implements OnInit, OnChanges{

    @Input() dataId: number
    @Input() dataTable: any
    @Input() dataType: 'INVOICE' | 'MAINTENANCE' | 'BILL'
    @Output() onSubmit = new EventEmitter<any>();
    sortedData: any
    displayedListColumns = ['description', 'created_at', 'action', 'user']
    form: FormGroup
    submitted: boolean = false

    constructor(
            private maintenanceService: MaintenanceService,
            private formBuilder: FormBuilder,
            private invoiceService: InvoiceService,
            private billService: BillService
                ) {
    }
    ngOnInit(): void {
        this.initForm()
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.sortedData = _orderBy(changes.dataTable.currentValue,['created_at'] , ['desc']);
        console.log('sorted',this.sortedData)
    }

    displayItems = (item) => {
        return this.maintenanceService.formatHistoryDescription(item);
    }

    initForm(){
        this.form = this.formBuilder.group({
            description: [null, Validators.required]
        })
    }
    saveHistory() {
        this.submitted = true;

        if (this.form.valid) {
            const params = Object.assign({}, this.form.value, {
                id: this.dataId
            });

            if (this.dataType === 'INVOICE') {
                this.invoiceService.addHistory(params).pipe(
                    tap(()=>{
                        this.submitted = false;
                        this.form.reset();
                        this.onSubmit.emit();
                        // this.notification.success(null, 'SAVE_SUCCESS');
                        console.log('SAVE_SUCCESS')
                    })
                ).subscribe()
            }
            else if (this.dataType === 'BILL') {
                this.billService.addHistory(params).pipe(
                    tap(()=>{
                        this.submitted = false;
                        this.form.reset();
                        this.onSubmit.emit();
                        // this.notification.success(null, 'SAVE_SUCCESS');
                        console.log('save success')
                    })
                ).subscribe()
            }
            else {
                this.maintenanceService.addHistory(params).pipe(
                    tap(()=>{
                        this.submitted = false;
                        this.form.reset();
                        this.onSubmit.emit();
                        // this.notification.success(null, 'SAVE_SUCCESS');
                        console.log('save success')
                    })
                ).subscribe()
            }
        }
        else {
            // this.notification.error(null, 'FORM_NOT_VALID');
            console.log('FORM_NOT_VALID')
        }
    }

}
