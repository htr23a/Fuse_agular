import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import moment from "moment/moment";
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {LeaveService} from "../leave.service";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialog} from "@angular/material/dialog";
import {DialogRejectComponent} from "../dialog-reject/dialog-reject.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    imports: [
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        CurrencyPipe,
        DatePipe,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        NgIf,
        MatMenuModule
    ],
    standalone: true
})
export class SummaryComponent implements OnInit {
    dateForm: FormGroup
    isLoadingResults = true;
    isRateLimitReached = false;
    data = [];
    displayedColumns = ['contact', 'pattern', 'start_date', 'end_date', 'status', 'user', 'action'];
    resultsLength = 0;

    constructor(private _formBuilder: FormBuilder,
                private leaveService: LeaveService,
                private dialog: MatDialog,
                private router: Router
                ) {
    }

    ngOnInit() {
        this.initDateForm()
        setTimeout(() =>
        {
            this.data = this.leaveService.getSummary()
            this.isLoadingResults = false
        }, 1000);
    }

    private initDateForm() {
        this.dateForm = this._formBuilder.group({
            start: [moment().startOf('month').toDate(), Validators.required],
            end: [moment().endOf('day').toDate(), Validators.required]
        })
    }

    filter() {
        console.log(this.dateForm.value)
    }

    accept(row: any){
        console.log(row)
    }

    openRejectModal(row: any){
        this.dialog.open(DialogRejectComponent, {
            data: {
                selectedItem: row,
            },
        });
    }

    navigateToHistory(id: number){
        console.log('navigate')
        this.router.navigate([`leave/detail/${id}`])
    }
}
