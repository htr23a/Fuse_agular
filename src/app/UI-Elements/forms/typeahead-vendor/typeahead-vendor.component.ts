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
import {TypeaheadVendorService} from "../../../core/services/typeahead/typeaheadVendor.service";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule, ValidationErrors, Validators
} from "@angular/forms";
import {AsyncPipe, NgForOf} from "@angular/common";
import {CheckStatusRequiredService} from "../../../shared/services/checkStatusRequired.service";

@Component({
    selector: 'app-typeahead-vendor',
    templateUrl: './typeahead-vendor.component.html',
    styleUrls: ['./typeahead-vendor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: TypeaheadVendorComponent
        }
    ],
    imports: [
        MatInputModule,
        MatAutocompleteModule,
        FormsModule,
        AsyncPipe,
        NgForOf,
        ReactiveFormsModule
    ],
    standalone: true
})
export class TypeaheadVendorComponent implements ControlValueAccessor, OnInit, Validators, AfterViewChecked {
    searchControlVendor = new FormControl('')
    filteredOptions: Observable<any> = of([])
    value: null
    display: null
    search: null
    disabled: boolean
    isRequired: boolean
    optionSelected = false
    @Output() bindDataVendor = new EventEmitter<any>()
    @Input() min: number
    @Input() submitted: boolean

    constructor(private typeaheadVendorService: TypeaheadVendorService,
                private checkRequiredService: CheckStatusRequiredService,
                private readonly changeDetectorRef: ChangeDetectorRef
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
        this.searchControlVendor.valueChanges.subscribe(fn)
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn
    }

    writeValue(obj: any): void {
        this.value = obj
        this.searchControlVendor.setValue(obj)
    }

    ngOnInit(): void {
        this.debounceInputVendor()

    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.submitted && this.isRequired && (!this.value || !Object.keys(this.value).length) ? {isRequired: true} : null;
    }


    debounceInputVendor() {
        this.searchControlVendor.valueChanges.pipe(
            debounceTime(900),
            distinctUntilChanged(),
            filter(value => value && value.trim().length >= this.min))
            .subscribe(value => {
                if (value) {
                    this.filteredOptions = this.typeaheadVendorService.get(value.trim().toLowerCase())

                }
            });
    }


    onOptionSelected(event: any) {

        const dataVendor = event.option.id
        this.bindDataVendor.emit(dataVendor)
        this.optionSelected = true
    }

    clear() {
        this.display = null;
        this.search = null;
        this.value = null;
        this.onChange(null);
    }

    remove() {
        this.searchControlVendor.patchValue('')
        this.filteredOptions = of([])
        this.checkRequiredService.Reset(true)
    }

}
