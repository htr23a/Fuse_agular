import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {TypeaheadVendorComponent} from "../../../../../UI-Elements/forms/typeahead-vendor/typeahead-vendor.component";
import {
  TypeaheadContactComponent
} from "../../../../../UI-Elements/forms/typeahead-contact/typeahead-contact.component";
import {
  SelectCategoryTypeComponent
} from "../../../../../UI-Elements/forms/select-category-type/select-category-type.component";
import {MatInputModule} from "@angular/material/input";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import moment from "moment";
import {AppService} from "../../../../../core/services/app/app.service";
import {AppModule} from "../../../../../app.module";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatTable, MatTableModule} from "@angular/material/table";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatOptionModule} from "@angular/material/core";
import {InventoryService} from "../../../../../core/services/inventory/inventory.service";
import Item, {ItemInventory} from "../../../../../core/models/item";
import {NgSelectModule} from "@ng-select/ng-select";
import {TaxService} from "../../../../../core/services/tax/tax.service";
import Tax from "../../../../../core/models/tax";
import {SessionService} from "../../../../../core/services/session/session.service";
import Bill from "../../../../../core/models/bill";
import {PrintBillService} from "../../../../../core/services/print/printBill.service";
import {FuseAlertComponent} from "../../../../../../@fuse/components/alert";
import {CheckStatusRequiredService} from "../../../../../shared/services/checkStatusRequired.service";
import {SettingsCompanyService} from "../../../../../core/services/settings-company.service";

@Component({
  selector: 'app-bill-add',
  templateUrl: './bill-add.component.html',
  styleUrls: ['./bill-add.component.scss'],

  imports: [
    MatCardModule,
    MatButtonModule,
    TypeaheadVendorComponent,
    TypeaheadContactComponent,
    SelectCategoryTypeComponent,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    AppModule,
    NgIf,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatAutocompleteModule,
    MatOptionModule,
    NgForOf,
    NgSelectModule,
    NgClass,
    FuseAlertComponent,
  ],
  standalone: true
})
export class BillAddComponent implements OnInit {
  VendorPhone: number
  ContactPhone: number
  addBillForm: FormGroup
  searchCategoryControl = new FormControl('')
  date = new FormControl(moment());
  data: any
  option: any
  dataVendor: any
  dataContact: any
  dataCategory: any
  items: Item[] = [];
  group: Item
  taxes: Tax[]
  amount: number;

  submitted = false

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild('inputItem') input: ElementRef<HTMLInputElement>;
  @ViewChild('units') inputUnit: ElementRef<HTMLInputElement>;


  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private inventoryService: InventoryService,
    private taxService: TaxService,
    private sessionService: SessionService,
    private printService: PrintBillService,
    private checkStatusService: CheckStatusRequiredService,
    private settingsCompanyService: SettingsCompanyService
  ) {
  }

  ngOnInit(): void {
    this.initForm()
    this.loadDataItemDefaultConfig()
    this.getTaxes()
    this.resetData()
    this.getCompanyInfo()
  }

  getDataCategory(event: any) {
    this.dataCategory = event
  }

  getDataContact(event: any) {
    this.ContactPhone = event.phone
    this.dataContact = event
  }

  getDataVendor(event: any) {
    this.VendorPhone = event.phone
    this.dataVendor = event
  }

  private initForm() {
    this.addBillForm = this.formBuilder.group(
      {
        vendor: null,
        contact: null,
        category: [null, Validators.required],
        currency_code: 'MGA',
        currency_rate: 1,
        billed_at: new Date(),
        due_at: new Date(),
        bill_number: this.appService.getBillCode(),
        order_number: null,
        notes: null,
        bill_status_code: 'draft',
        BillItems: this.formBuilder.array([]),
      }
    );

    this.addItem();
  }


  get BillItems(): FormArray {
    return this.addBillForm.get('BillItems') as FormArray;
  }


  addItem() {
    const company_id = this.sessionService.getCompanyId();

    const fb = this.formBuilder.group({
      company_id: company_id,
      description: null,
      item_id: 0,
      item_type: 'GOODS',
      item: [null, Validators.required],
      name: ['', Validators.required],
      storage_id: null,
      unit_id: null,
      quantity: [1, Validators.required],
      units: null,
      price: [0, [Validators.required, Validators.min(1)]],
      total: 0,
      sku: null,
      meta: null,
      Taxes: null
    });
    this.BillItems.push(fb)
  }

  removeItem(index: any) {
    this.BillItems.removeAt(index);
  }

  getPaymentDue() {
    this.amount = 0;
    const items = this.addBillForm.controls['BillItems'].value;

    for (let i = 0; i < items.length; i++) {
      this.amount += items[i]['quantity'] * items[i]['price'];
    }

    return this.amount;
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
          this.option = [...this.items];
          console.log(this.items)
        }
      })
      .catch((err) => {
        console.log(err)
      });
  }

  reset() {
    this.addBillForm.patchValue({
      units: '',
      item: ''
    })
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.searchCategoryControl.patchValue('')
    if (!filterValue) {
      this.items = this.option
    }
    else {
      this.items = this.option.filter(o => o.name.toLowerCase().includes(filterValue));
    }
  }


  onSelectionItemChange(event: any, group: any) {
    if (event && event.id) {
      group.patchValue({
        item: event.name,
        item_id: event.id,
        item_type: event.type || 'GOODS',
        name: event.name,
        price: event.purchase_price,
        units: event.Inventories.map((inventory: ItemInventory) => {
          return {
            id: inventory.unit_id,
            name: inventory.ItemUnit.name,
            storage_id: inventory.InventoryStorage ? inventory.InventoryStorage.id : null,
            remainingQuantity: inventory.quantity
          };
        }),
        unit_id: event.available.unit_id
      });
    }
  }

  save() {
    console.log(this.addBillForm)
    this.submitted = true
    if (this.addBillForm.valid) {
      const formValue = this.addBillForm.value;
      if (formValue.BillItems) {
        formValue.BillItems.forEach((billItem: any) => {
          delete billItem.item;
          delete billItem.units;
        });
      }

      const bill = new Bill(
        Object.assign({}, formValue, {
          vendor: this.dataVendor,
          contact: this.dataContact,
          category: this.dataCategory,
          contact_id: this.dataContact ? this.dataContact.id : null,
          contact_name: this.dataContact ? this.dataContact.name : null,
          contact_phone: this.dataContact ? this.dataContact.phone : null,
          amount: this.getPaymentDue(),
          currency_code: 'MGA',
          category_id: this.dataCategory.id,
          category_name: this.dataCategory.name,
          vendor_id: this.dataVendor ? this.dataVendor.id : null,
        })
      );

      console.log(bill)
      this.printService.bill(bill)
      /* this.expenseService
           .createWithUnit(bill)
           .then((res) => {
               // this.router.navigate(['/expense/bill/detail/', res.id]);
               // this.notification.success(null, 'SAVE_SUCCESS');
               console.log('save success')
           })
           .catch((err) => {
               // this.notification.error(null, err.error);
               console.log(err.error)
           });*/
    }
    else {
      console.log('form not valid')
    }
  }

  onSelectedUnit(event: any, group: any) {

    console.log(event)

    group.patchValue({
      unit_id: event ? event.id : null,
      storage_id: event ? event.storage_id : null
    });
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


  resetData() {
    this.checkStatusService.isReset$.subscribe(
      (res) => {
        if (res) {
          this.dataVendor = undefined
        }
      }
    )
    this.checkStatusService.isResetContact$.subscribe(
      (res) => {
        if (res) {
          this.dataContact = undefined
        }
      }
    )
  }

  private getCompanyInfo() {
    const id = this.sessionService.getActiveCompany().id;
    console.log(id)

    this.settingsCompanyService.getSettings(id).subscribe({
      next: (res) => {
        const settings = JSON.stringify({
          tos: res.Settings['general.company_tos'],
          tos_package: res.Settings['general.company_tos_package'],
          name: res.Settings['general.company_name'],
          email: res.Settings['general.company_email'],
          phone: res.Settings['general.company_phone'],
          seal: res.Settings['general.company_seal'],
          address_1: res.Settings['general.company_address_line_1'],
          address_2: res.Settings['general.company_address_line_2'],
          default_print_mode: res.Settings['general.default_print_mode'],
          logo: res.Settings['general.company_logo'],
          signature: res.Settings['general.company_signature'],
          nif: res.Settings['general.company_NIF'],
          stat: res.Settings['general.company_STAT'],
          rcs: res.Settings['general.company_RCS'],
          parcel_price_by_volume: res.Settings['general.default_parcel_price_by_volume'],
          parcel_calculation_mode: res.Settings['general.default_parcel_calculation_mode'],
          parcel_insurance_percentage: res.Settings['general.default_parcel_insurance_percentage'],
          parcel_coefficient_increase: res.Settings['general.default_parcel_coefficient_increase'],
          parcel_coefficient_volumic_mass: res.Settings['general.default_parcel_coefficient_volumic_mass'],
          default_invoice_category: +res.Settings['general.default_invoice_category'],
          default_provider: +res.Settings['general.default_provider'],
          default_fuel_product: +res.Settings['general.default_fuel_product'],
          default_men_insurance_item: +res.Settings['general.default_men_insurance_item'],
          default_hotel_event_type: +res.Settings['general.default_hotel_event_type'],
          default_men_intervention_category: +res.Settings['general.default_men_intervention_category'],
          default_inventory_category: +res.Settings['general.default_inventory_category'],
          default_inventory_out_category: +res.Settings['general.default_inventory_out_category'],
          default_inventory_transfer_category: +res.Settings['general.default_inventory_transfer_category'],
          default_inventory_out_type: res.Settings['general.default_inventory_out_type'],
          default_inventory_order_type: res.Settings['general.default_inventory_order_type'],
          default_inventory_room: +res.Settings['general.default_inventory_room'],
          default_health_category: +res.Settings['general.default_health_category'],
          default_inventory_storage: +res.Settings['general.default_inventory_storage'],
          default_cleaning_type: res.Settings['general.default_cleaning_type'],
          default_timeline_event_type: res.Settings['general.default_timeline_event_type'],
          default_tracker_category: +res.Settings['general.default_tracker_category'],
          default_trip_displaced_payment_category: +res.Settings['general.default_trip_displaced_payment_category'],
          default_trip_expense_category: +res.Settings['general.default_trip_expense_category'],
          default_trip_participation_category: +res.Settings['general.default_trip_participation_category'],
          default_trip_manifest_category: +res.Settings['general.default_trip_manifest_category'],
          default_trip_versement_category: +res.Settings['general.default_trip_versement_category'],
          default_part_category: +res.Settings['general.default_part_category'],
          default_fuel_category: +res.Settings['general.default_fuel_category'],
          default_labour_category: +res.Settings['general.default_labour_category'],
          default_bill_part_category: +res.Settings['general.default_bill_part_category'],
          default_bill_labour_category: +res.Settings['general.default_bill_labour_category'],
          default_bill_fuel_category: +res.Settings['general.default_bill_fuel_category'],
          default_bill_trip_expense_category: +res.Settings['general.default_bill_trip_expense_category'],
          default_bill_inventory_transfer_category: +res.Settings['general.default_bill_inventory_transfer_category'],
          meta: res.Settings['general.company_meta'] ? JSON.parse(res.Settings['general.company_meta']) : {}
        });

        sessionStorage.setItem(SettingsCompanyService.KEY, settings);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
