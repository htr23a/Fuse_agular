import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BillService} from "../../../../core/services/bill/bill.service";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        NgIf
    ],
    standalone: true
})
export class SearchComponent {
    searchForm: FormGroup;

    submitted: boolean;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private billService: BillService,
               ) {}

    ngOnInit() {
        this.initForm();
    }

    search() {
        this.submitted = true;

        if (this.searchForm.valid) {
            const id = this.searchForm.get('term').value;

            this.billService.search(id)
                .toPromise()
                .then(res => {
                    if (res) {
                        this.router.navigate(['/expense/bill/detail/', id]);
                    }
                    else {
                        // this.notification.error(null, 'INVOICE_NOT_FOUND');
                    }
                })
                .catch(err => {
                    // this.notification.error(null, err.error)}
                    console.log(err)
                    }
                );
        }
        else {
            // this.notification.error(null, 'FORM_NOT_VALID');
                console.log('FORM_NOT_VALID')
        }
    }

    resetTerm(){
        this.searchForm.patchValue(
            { term: ''}
        )
    }

    private initForm() {
        this.searchForm = this.formBuilder.group({
            term: ['', Validators.required]
        });
    }
}
