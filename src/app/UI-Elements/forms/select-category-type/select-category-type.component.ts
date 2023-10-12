import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {NgForOf} from "@angular/common";
import {SelectCategoryTypeService} from "../../../core/services/typeahead/selectCategoryType.service";
import {distinctUntilChanged, filter} from "rxjs";

@Component({
    selector: 'app-select-category-type',
    templateUrl: './select-category-type.component.html',
    styleUrls: ['./select-category-type.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: SelectCategoryTypeComponent
        }
    ],
    imports: [
        MatInputModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        NgForOf
    ],
    standalone: true
})
export class SelectCategoryTypeComponent implements ControlValueAccessor, OnInit {
    searchCategoryControl = new FormControl('');
    dataCategory: any
    optionCategory: any
    value: null
    display: null
    disabled: boolean
    search: null
    @Output() bindDataCategory = new EventEmitter<any>()

    constructor(private selectCategoryService: SelectCategoryTypeService) {
    }

    onChange = (value: string) => {

    }
    onTouch = () => {

    }

    registerOnChange(fn: any): void {
        this.onChange = fn
        this.searchCategoryControl.valueChanges.subscribe(fn)
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn
    }

    writeValue(obj: any): void {
        this.value = obj
        this.searchCategoryControl.setValue(obj)
    }

    ngOnInit(): void {
        this.loadDataCategory()
        this.filterCategory()
    }

    filterCategory(): void {
        this.searchCategoryControl.valueChanges.pipe(
            distinctUntilChanged(),
            filter(value => value && value.trim().length >= 1)
        ).subscribe(
            filterValue => {
                if (filterValue) {
                    this.dataCategory = this.optionCategory.filter(o => o.name.toLowerCase().includes(filterValue));
                }
                else {
                    this.dataCategory = this.optionCategory
                }
            }
        )
    }

    onSelectionCategoryChange(event: any) {
        //     bind data to parent
        const selectedCategory = event.option.value
        this.searchCategoryControl.setValue(selectedCategory)
        this.bindDataCategory.emit(event.option.id)
    }

    loadDataCategory() {
        this.selectCategoryService.get('expense').subscribe(
            (data) => {
                this.dataCategory = data;
                this.optionCategory = data;
            }
        )
    }

    clear() {
        this.display = null;
        this.search = null;
        this.value = null;
        this.onChange(null);
    }

    reset() {
        this.searchCategoryControl.patchValue('')
        this.dataCategory = this.optionCategory
    }

}
