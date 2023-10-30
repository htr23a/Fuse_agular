import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Subject} from "rxjs";
import {CalendarEvent} from "angular-calendar";
import {endOfDay, startOfDay, subDays} from "date-fns";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerInputEvent, MatDatepickerModule} from "@angular/material/datepicker";
import {LeaveService} from "../leave.service";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import moment from "moment/moment";
import {Router} from "@angular/router";

@Component({
    selector: 'app-dialog-add',
    templateUrl: './dialog-add.component.html',
    styleUrls: ['./dialog-add.component.scss'],
    imports: [
        MatInputModule,
        MatDatepickerModule,
        FormsModule,
        MatAutocompleteModule,
        NgForOf,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule
    ],
    standalone: true
})
export class DialogAddComponent implements OnInit{
    refresh = new Subject<void>();
    addForm: FormGroup
    title: string
    start: Date
    end: Date
    dataLeave: CalendarEvent[]
    color: any
    contacts = []
    contactSelected: any
    numberDayOff: number = 0
    startDateSelected: Date
    endDateSelected: Date
    reset: boolean = false
    saveNumberDayOff: number
    maxDate: Date
    dateDiff: number = 0
    minDate = new Date()
    constructor(
        private leaveService: LeaveService,
        private formBuilder: FormBuilder,
        private route: Router,
        private dialog: MatDialog,
    ) {
    }

    ngOnInit(){
        this.initForm()
        this.contacts = this.leaveService.getContact()
        this.getCurrentLeavePay()
        this.dateDiff = 0;
    }

    initForm() {
        this.addForm = this.formBuilder.group(
            {
                contact: [null, Validators.required],
                color: [null, Validators.required],
                start_at: [null, Validators.required],
                end_at: [null, Validators.required],
                pattern: [null, Validators.required]
            }
        )
        this.startDateSelected = new Date(this.addForm.get('start_at').value);
        // this.endDateSelected = new Date(this.addForm.get('end_at').value);
        console.log(this.addForm.get('start_at').value)
    }
    displayFn(item: any): string {
        return item ? item.name : '';
    }


    onOptionSelected(event: any){
        this.contactSelected = event.option.value
        this.numberDayOff = this.contactSelected.number_days_off
        this.saveNumberDayOff = this.numberDayOff
    }
    addLeave(){
        if(this.addForm.valid){
            if(this.numberDayOff >= 0){
                const item: CalendarEvent = {
                    color: {
                        primary: this.addForm.get('color').value,
                        secondary: ''
                    },
                    start: new Date(this.addForm.get('start_at').value),
                    end: new Date(this.addForm.get('end_at').value),
                    title:  `Congé de ${this.contactSelected.name}, motif : ${this.addForm.get('pattern').value}`,
                    allDay: true,
                    resizable: {
                        beforeStart: true,
                        afterEnd: true,
                    },
                    id: this.contactSelected.id,
                }
                console.log(item)
                this.leaveService.addItem(item)
                // this.route.navigateByUrl('leave')
                this.dialog.closeAll()
            }

            else {
                console.log('SOLDE DE CONGE DEPASSER')
            }
        }
        else {
            console.log('FORM_NOT_VALID')
        }
    }

    startDate(event: any){
        console.log(event.value)
        const dateNow = new Date()
        this.numberDayOff = this.saveNumberDayOff
        this.startDateSelected = new Date(event.value)
        this.getCurrentLeavePay()
        this.maximumDate()
        this.addForm.patchValue({
            end_at: null
        })
    }

    endDate(event: any){
        this.numberDayOff = this.saveNumberDayOff
        this.endDateSelected = new Date(event.value)
        console.log(this.endDateSelected)
        this.getCurrentLeavePay()
    }

    getCurrentLeavePay(){
        if (this.startDateSelected && this.endDateSelected){
             this.dateDiff = this.leaveService.calculateDateDifference(this.startDateSelected, this.endDateSelected)
            this.numberDayOff = ( this.numberDayOff -1 )  - this.dateDiff
            this.dateDiff++
        }
    }

    resetFrom(){
       this.addForm.patchValue({
           start_at: moment().endOf('day').toDate(),
           end_at: moment().endOf('day').toDate(),
       })
        this.numberDayOff = this.saveNumberDayOff
    }

    maximumDate() {
        this.numberDayOff = this.saveNumberDayOff
        if (this.startDateSelected) {
            this.maxDate = new Date(this.startDateSelected);
            this.maxDate.setDate(this.maxDate.getDate() + this.numberDayOff);
        } else {
            this.maxDate = null;
        }
    }
}
