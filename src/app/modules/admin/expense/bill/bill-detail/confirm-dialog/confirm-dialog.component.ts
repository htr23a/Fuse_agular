import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BillService} from "../../../../../../core/services/bill/bill.service";
import Bill from "../../../../../../core/models/bill";
import {Router} from "@angular/router";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        private billService: BillService,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any
        ) {
    }

    cancel() {
        this.billService.cancelWithUnit(this.data.bill)
            .toPromise()
            .then(() => {
                this.router.navigate(['expense/bill/list'])
                // this.notification.info(null, 'BILL_CANCELED');
                console.log('BILL_CANCELED')
            })
            .catch((err) => {
                console.log(err)
            });
    }
}
