import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import moment from 'moment';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    merge,
    Observable,
    of as observableOf,
    startWith,
    Subject,
    switchMap
} from "rxjs";
import {ExpenseService} from "../../../../core/services/bill/expense.service";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";

@Component({
    selector: 'app-bill',
    templateUrl: './bill.component.html',
    styleUrls: ['./bill.component.scss'],
    imports: [
        MatInputModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        NgIf,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        DatePipe,
        MatAutocompleteModule,
        FormsModule,
        NgForOf,
        AsyncPipe,
        MatSelectModule
    ],
    standalone: true
})
export class BillComponent implements OnInit, AfterViewInit {

    dateForm: FormGroup
    searchDisplayColumns: string[] = ['columnOne', 'searchContact', 'searchCategory', 'searchDescription', 'columnFive', 'searchAmount']
    displayedColumns: string[] = ['paid_at', 'contact_name', 'category', 'description', 'account', 'amount', 'createdAt'];
    searchTerm = ''
    searchCategory = ''
    inputDebounceSearch = new Subject<string>()
    searchDescriptionUpdate = new Subject<string>()
    filteredOptions: Observable<any>
    searchCategoryControl = new FormControl('');
    searchAmountControl = new FormControl('')
    searchDescription: string

    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;
    data: any
    dataCategory: any
    optionCategory: any

    dataAmount: string[] = ['Airtel money', 'BNI P@Y', 'Carte credit', 'Chèque', 'Espece', 'MVola', 'Orange money', 'Récompense', 'SP', 'Virement bancaire', 'Western Union']

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('teams') teams!: ElementRef;
    @ViewChild('inputSearchCategory') input: ElementRef<HTMLInputElement>;
    @ViewChild('inputSearchAmount') inputAmount: ElementRef<HTMLInputElement>;

    constructor(private _formBuilder: FormBuilder, private expenseService: ExpenseService) {
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    const tableState = {
                        filter: {},
                        sort: {
                            direction: this.sort.direction,
                            pointer: this.sort.active
                        },
                        slice: {
                            page: this.paginator.pageIndex + 1,
                            size: 25
                        },
                        search: {}
                    }
                    return this.expenseService.paginate(tableState)
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

    ngOnInit() {
        this.initDataForm()
        this.debounceInputContact()
        this.debounceInputDescription()
        this.loadDataCategory()
    }

    filterCategory(): void {
        const filterValue = this.input.nativeElement.value.toLowerCase();
        if (!filterValue) {
            this.loadDataBillDefaultConfig()
        }
        else {
            this.dataCategory = this.optionCategory.filter(o => o.name.toLowerCase().includes(filterValue));
        }
    }

    filterAmount() {
        const filterValue = this.inputAmount.nativeElement.value.toLowerCase()
        if (filterValue) {
            this.dataAmount = this.optionCategory.filter(o => o.name.toLowerCase().includes(filterValue));

        }
    }

    private initDataForm() {
        this.dateForm = this._formBuilder.group({
            start: [moment().startOf('month').toDate(), Validators.required],
            end: [moment().endOf('day').toDate(), Validators.required]
        })
    }

    debounceInputContact() {
        this.inputDebounceSearch.pipe(
            debounceTime(900),
            distinctUntilChanged())
            .subscribe(value => {
                if (value) {
                    this.filteredOptions = this.expenseService.select(value.trim().toLowerCase())
                }
            });
    }

    debounceInputDescription() {
        this.searchDescriptionUpdate.pipe(
            debounceTime(900),
            distinctUntilChanged())
            .subscribe(value => {
                if (!value) {
                    this.loadDataBillDefaultConfig()
                }
                else {
                    this.isLoadingResults = true
                    const config = {
                        filter: {},
                        search: {
                            value: value,
                            scope: ['description'],
                            flags: 'i',
                            escape: false
                        },
                        sort: {
                            direction: this.sort.direction,
                            pointer: this.sort.active
                        },
                        slice: {
                            page: this.paginator.pageIndex + 1,
                            size: 25
                        }
                    }
                    this.expenseService.paginate(config).pipe(
                        map((res) => {
                            this.data = res.data
                            this.isLoadingResults = false
                        })
                    ).subscribe()
                }
            });
    }

    loadDataBillDefaultConfig() {
        this.isLoadingResults = true
        const tableState = {
            filter: {},
            sort: {
                direction: this.sort.direction,
                pointer: this.sort.active
            },
            slice: {
                page: this.paginator.pageIndex + 1,
                size: 25
            },
            search: {}
        }
        this.expenseService.paginate(tableState).pipe(
            map((res) => {
                this.isLoadingResults = false
                this.data = res.data
            })
        ).subscribe()
    }

    onOptionSelected(event: any): void {
        this.isLoadingResults = true
        const user_id = +event.option.id;
        const config = {
            filter: {
                contact_id: [{
                    operator: "equals",
                    type: "number",
                    value: user_id
                }],
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
            sort: {
                direction: this.sort.direction,
                pointer: this.sort.active
            },
            slice: {
                page: this.paginator.pageIndex + 1,
                size: 25
            },
            search: {}
        }
        this.expenseService.paginate(config).pipe(
            map((res) => {
                this.isLoadingResults = false
                this.data = res.data
            })
        ).subscribe()

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
        this.expenseService.paginate(filterConfig).pipe(
            map((res) => {
                this.isLoadingResults = false
                this.data = res.data
            })
        ).subscribe()
    }

    reset() {
        this.loadDataBillDefaultConfig()
    }


    loadDataCategory() {
        this.expenseService.categoryExpense('expense').subscribe({
                next: (data) => {
                    this.dataCategory = data;
                    this.optionCategory = data
                },
                error: (error) => {
                    console.log('Erreur lors du chargement des données :', error)
                }
            },
        );
    }

    onSelectionCategoryChange(event: any): void {
        this.isLoadingResults = true

        const category_id = +event.id;
        const config = {
            filter: {
                category_id: [{
                    operator: "equals",
                    type: "number",
                    value: category_id
                }]
            },
            sort: {
                direction: this.sort.direction,
                pointer: this.sort.active
            },
            slice: {
                page: this.paginator.pageIndex + 1,
                size: 25
            },
            search: {}
        }
        this.expenseService.paginate(config).pipe(
            map((res) => {
                this.data = res.data
                this.isLoadingResults = false
            })
        ).subscribe()
    }

    onSelectionAmountChange(event: any) {
        // API doesn't exist
    }
}
