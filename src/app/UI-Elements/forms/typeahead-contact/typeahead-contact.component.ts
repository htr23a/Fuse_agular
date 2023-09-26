import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, Observable, of} from "rxjs";
import {TypeaheadContactService} from "../../../core/services/typeahead/typeaheadContact.service";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {
    ControlValueAccessor,
    FormControl,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from "@angular/forms";
import {AsyncPipe, NgForOf} from "@angular/common";
import {CheckStatusRequiredService} from "../../../shared/services/checkStatusRequired.service";

@Component({
    selector: 'app-typeahead-contact',
    templateUrl: './typeahead-contact.component.html',
    styleUrls: ['./typeahead-contact.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: TypeaheadContactComponent
        }
    ],
    imports: [
        MatInputModule,
        MatAutocompleteModule,
        FormsModule,
        NgForOf,
        AsyncPipe,
        ReactiveFormsModule
    ],
    standalone: true
})
export class TypeaheadContactComponent implements ControlValueAccessor, OnInit, AfterViewChecked {
    filteredOptions: Observable<any>
    display: null
    value: null
    search: null
    contact: any
    disabled = false
    searchControlContact = new FormControl('');
    @Output() bindDataContact = new EventEmitter<any>()
    @Input() min: number

    constructor(private typeaheadContactService: TypeaheadContactService,
                private changeDetectorRef: ChangeDetectorRef,
                private checkStatusService: CheckStatusRequiredService
    ) {
    }

    onChange = (value: string) => {

    }
    onTouch = () => {

    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
        this.searchControlContact.valueChanges.subscribe(fn)
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn
    }

    writeValue(obj: any): void {
        this.value = obj
        this.searchControlContact.setValue(obj)
    }

    ngOnInit(): void {
        this.debounceInputContact()
    }

    debounceInputContact() {
        this.searchControlContact.valueChanges.pipe(
            debounceTime(900),
            distinctUntilChanged(),
            filter(value => value && value.trim().length >= this.min))
            .subscribe(value => {
                if (value)
                    this.filteredOptions = this.typeaheadContactService.get(value.trim().toLowerCase())
            });
    }

    reset() {
    }

    onOptionSelected(event: any) {
        // bind to parent
        const selectedContactName = event.option.value
        this.searchControlContact.setValue(selectedContactName)
        const dataContact = event.option.id
        this.bindDataContact.emit(dataContact)

    }

    clear() {
        this.display = null;
        this.search = null;
        this.value = null;
        this.onChange(null);
    }

    remove() {
        this.searchControlContact.patchValue('')
        this.filteredOptions = of([])
        this.checkStatusService.ResetContact(true)
    }

}
