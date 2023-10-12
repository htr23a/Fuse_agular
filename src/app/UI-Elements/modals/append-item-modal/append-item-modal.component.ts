import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AsyncPipe, CurrencyPipe, NgForOf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatTableModule} from "@angular/material/table";
import {InventoryService} from "../../../core/services/inventory/inventory.service";
import {NgSelectModule} from "@ng-select/ng-select";
import Item, {ItemInventory} from "../../../core/models/item";
import {MatSelectModule} from "@angular/material/select";
import Tax from "../../../core/models/tax";
import {TaxService} from "../../../core/services/tax/tax.service";
import {SessionService} from "../../../core/services/session/session.service";
import {conditionalValidator} from "../../../shared/validator/ConditionalValidator";

@Component({
    selector: 'app-append-item-modal',
    templateUrl: './append-item-modal.component.html',
    styleUrls: ['./append-item-modal.component.scss'],
    imports: [
        MatDialogModule,
        MatButtonModule,
        AsyncPipe,
        FormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatTableModule,
        NgForOf,
        ReactiveFormsModule,
        NgSelectModule,
        MatSelectModule,
        CurrencyPipe
    ],
    standalone: true
})
export class AppendItemModalComponent implements OnInit, AfterViewInit {

    items: Item[] = [];
    option: any
    articleForm: FormGroup
    units = []
    taxes: Tax[]
    submitted: boolean = false
    selectedUnit: any
    filteredUnits: any

    @Input() type: 'BILL' | 'REQUEST' | 'HEALTH' | 'INVOICE' = 'REQUEST';
    @Input() selected: any;

    constructor(public dialogRef: MatDialogRef<AppendItemModalComponent>,
                private inventoryService: InventoryService,
                private formBuilder: FormBuilder,
                private taxService: TaxService,
                private sessionService: SessionService
    ) {
    }

    @ViewChild('inputSearchArticle') input: ElementRef<HTMLInputElement>;
    @ViewChild('inputSearchUnit') inputUnit: ElementRef<HTMLInputElement>;

    ngOnInit(): void {
        // this.loadDataItemDefaultConfig()
        this.initForm()
        this.getTaxes()
        if (this.selected) {
            if (this.isInventory(this.selected.item_type)) {
                this.loadUnits();
            }

            this.articleForm.patchValue(this.selected);
        }
    }


    ngAfterViewInit(): void {
        this.loadDataItemDefaultConfig()
    }

    initForm() {
        this.articleForm = this.formBuilder.group({
            id: null,
            item_id: null,
            item: [null, Validators.required],
            description: null,
            item_type: 'GOODS',
            company_id: this.sessionService.getCompanyId(),
            name: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            price: [0, Validators.required],
            meta: this.getMetaByType(),
            units: null,
            total: 0,
            storage_id: [null, [
                conditionalValidator(() => {
                    const type = this.articleForm.get('item_type').value;
                    return this.isInventory(type);
                }, Validators.required, 'UNIT_EMPTY')
            ]],
            unit_id: null,

            Taxes: null,
            sku: ''
        })
    }

    isInventory(type: string) {
        return type === 'GOODS' || type === 'ASSET' || type === 'SERVICES';
    }

    private getMetaByType() {
        switch (this.type) {
            case 'HEALTH':
                return this.formBuilder.group({
                    dosage: [null, Validators.required],
                    administration_mode: [null, Validators.required],
                    duration: [null, Validators.required]
                });
            default:
                return null;
        }
    }

    loadDataItemDefaultConfig() {
        this.inventoryService
            .getInventoryByDefaultRoom(this.items)
            .then(() => {
                if (!this.items) {
                    console.log('item_not_set')
                }
                else {
                    this.items = [...this.items];
                    this.option = [...this.items]
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    filterArticle() {
        const filterValue = this.input.nativeElement.value.toLowerCase();
        if (!filterValue) {
            this.loadDataItemDefaultConfig()
        }
        else {
            this.items = this.option.filter(o => o.name.toLowerCase().includes(filterValue));
        }
    }

    onSelect(event: any) {
        this.articleForm.patchValue({
            storage_id: event ? event.source.id.storage_id : null
        });
        console.log()
    }

    reset() {
        this.articleForm.patchValue({
            item: '',
            unit_id: ''
        })
        this.items = this.option;
    }

    onSelectionUnitChange(event: any) {
        const selectedItem = event.option.value

        const purchase_price = event.option.value.purchase_price
        this.articleForm.patchValue({
            item_id: selectedItem.id,
            item_type: selectedItem.type,
            price: purchase_price,
            name: selectedItem.name,
            units: selectedItem.Inventories.map((inventory: ItemInventory) => {

                return {
                    id: inventory.unit_id,
                    name: inventory.ItemUnit.name,
                    storage_id: inventory.InventoryStorage ? inventory.InventoryStorage.id : null,
                    remainingQuantity: inventory.quantity
                }
            }),
            total: 0
        })

        console.log('units', this.articleForm.get('units').value)
    }

    displayFn(item: any): string {
        return item ? item.name : '';
    }

    saveArticle() {
        this.submitted = true;
        console.log(this.articleForm)
        if (this.articleForm.valid) {
            const value = this.articleForm.getRawValue();
            let it = value;

            if (this.selected) {
                const {id, description, meta, Taxes} = value;
                it = {id, description, meta, Taxes};
            }
            else {
                delete it.item;
                delete it.units;
            }
            console.log(it)
            this.dialogRef.close(it);
        }
        else {
            // this.notification.error(null, 'FORM_NOT_VALID');
            console.log('FORM NOT_VALID')
        }
    }

    private getTaxes() {
        this.taxService.list().subscribe({
            next: (res) => {
                this.taxes = res
            },
            error: (err) => {
                console.log(err)
            }
        })
    }

    getTotal = (formGroup: any) => {
        const total =
            formGroup.controls.quantity.value * formGroup.controls.price.value;

        formGroup.patchValue({total: total});
        return total;
    };

    private loadUnits() {
        this.inventoryService.getItemUnits().then(units => {
            console.log('units', units)
            this.units = units;
        }).catch(err => {
            // this.notification.error(null, err.error)
            console.log(err)
        });
    }
}
