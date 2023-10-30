import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {JsonPipe, NgForOf} from "@angular/common";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {LeaveService} from "../leave.service";

@Component({
    selector: 'app-dialog-detail',
    templateUrl: './dialog-detail.component.html',
    styleUrls: ['./dialog-detail.component.scss'],
    imports: [
        MatDialogModule,
        MatButtonModule,
        JsonPipe,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        NgForOf,
        ReactiveFormsModule,
        MatDatepickerModule
    ],
    standalone: true
})
export class DialogDetailComponent implements OnInit{
    profileForm: FormGroup
    numberDayOff: number
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private leaveService: LeaveService
    ) {
        console.log('data',this.data.modalData.event)
    }

    ngOnInit() {
        const selectedId = this.data.modalData.event.id
        const user = this.leaveService.getContactByPk(selectedId);
        this.numberDayOff = user.number_days_off
        const data = this.data.modalData.event
        console.log(user)
        const title = data.title.split('motif :')[1]
        this.profileForm = this.formBuilder.group({
            name: user?.name,
            address: user?.address,
            phone: user?.phone,
            job: user?.job,
            start_at: data.start,
            end_at: data?.end,
            title: title,
        })
    }

}
