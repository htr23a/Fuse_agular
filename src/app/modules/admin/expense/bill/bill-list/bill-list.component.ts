import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    merge,
    of as observableOf,
    startWith,
    Subject,
    switchMap
} from "rxjs";
import * as moment from "moment/moment";
import {BillService} from "../../../../../core/services/bill/bill.service";
import {MatTabsModule} from "@angular/material/tabs";
import {Router} from "@angular/router";

@Component({
    selector: 'app-bill-list',
    templateUrl: './bill-list.component.html',
    styleUrls: ['./bill-list.component.scss'],
    imports: [
        AsyncPipe,
        DatePipe,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        CurrencyPipe,
        MatTabsModule
    ],
    standalone: true
})
export class BillListComponent implements OnInit, AfterViewInit {

    displayedColumns: string[] = ['id', 'contact', 'category', 'amount', 'balance', 'due_at'];
    displayedDraftColumns = ['id', 'contact', 'category', 'amount', 'balance', 'due_at'];
    isLoadingResults = true;
    dateForm: FormGroup;
    data: any;
    isRateLimitReached = false;
    resultsLength = 0;
    search = '';
    searchUpdate = new Subject<string>();
    dataDraft: any;


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private billService: BillService,
        private _formBuilder: FormBuilder,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.initFilterForm()
        this.debounceInputDescription()
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    const tableState = {
                        filter: {
                            billed_at: [{
                                value: this.dateForm.value.start,
                                operator: 'gte',
                                type: 'string'
                            },
                                {
                                    value: this.dateForm.value.end,
                                    operator: 'lte',
                                    type: 'string'
                                }
                            ]
                        },
                        sort: {},
                        slice: {
                            page: this.paginator.pageIndex + 1,
                            size: 25
                        },
                        search: {}
                    }
                    return this.billService.paginate(tableState)
                        .pipe(catchError(() => observableOf(null)))
                }),
                map(res => {
                    this.isLoadingResults = false;
                    this.isRateLimitReached = res === null;

                    if (res === null) {
                        return [];
                    }

                    this.resultsLength = res.summary.filteredCount;
                    return res.data;
                }),
            )
            .subscribe(data => {
                this.data = data
            });
    }

    private initFilterForm() {
        this.dateForm = this._formBuilder.group({
            start: [moment().startOf('month').toDate(), Validators.required],
            end: [moment().endOf('day').toDate(), Validators.required]
        })
    }

    navigateToAddBill() {
        console.log('navigate')
        this.router.navigateByUrl('/expense/bill/add')
    }

    filter() {
        this.isLoadingResults = true
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        const filterConfig = {
            filter: {
                created_at: [{
                    value: this.dateForm.value.start,
                    operator: 'gte',
                    type: 'string'
                },
                    {
                        value: this.dateForm.value.end,
                        operator: 'lte',
                        type: 'string'
                    }
                ]
            },
            sort: {},
            slice: {
                page: this.paginator.pageIndex + 1,
                size: 25
            },
            search: {}
        }
        this.billService.paginate(filterConfig).pipe(
            map((res) => {
                this.isLoadingResults = false
                this.data = res.data
                console.log(res)
            })
        ).subscribe()
    }

    loadDataBillDefaultConfig() {
        this.isLoadingResults = true
        const tableState = {
            filter: {
                billed_at: [{
                    value: this.dateForm.value.start,
                    operator: 'gte',
                    type: 'string'
                },
                    {
                        value: this.dateForm.value.end,
                        operator: 'lte',
                        type: 'string'
                    }
                ]
            },
            sort: {},
            slice: {
                page: this.paginator.pageIndex + 1,
                size: 25
            },
            search: {}
        }
        this.billService.paginate(tableState).pipe(
            map((res) => {
                this.isLoadingResults = false
                this.data = res.data
            })
        ).subscribe()
    }

    debounceInputDescription() {
        this.searchUpdate.pipe(
            debounceTime(900),
            distinctUntilChanged())
            .subscribe(value => {
                if (!value) {
                    this.loadDataBillDefaultConfig()
                }
                else {
                    this.isLoadingResults = true
                    const config = {
                        filter: {
                            billed_at: [{
                                value: this.dateForm.value.start,
                                operator: 'gte',
                                type: 'string'
                            },
                                {
                                    value: this.dateForm.value.end,
                                    operator: 'lte',
                                    type: 'string'
                                }
                            ]
                        },
                        search: {
                            value: value,
                            scope: ['contact_name'],
                            flags: 'i',
                            escape: false
                        },
                        sort: {
                            direction: 'desc',
                            pointer: 'id'
                        },
                        slice: {
                            page: this.paginator.pageIndex + 1,
                            size: 25
                        }
                    }
                    this.billService.paginate(config).pipe(
                        map((res) => {
                            this.data = res.data
                            this.isLoadingResults = false
                        })
                    ).subscribe()
                }
            });
    }

    reset() {
        this.search = ''
        this.loadDataBillDefaultConfig()
    }

    // ------------ Draft component -------------//


}
