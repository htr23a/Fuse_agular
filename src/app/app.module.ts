import {NgModule} from "@angular/core";
import {AsyncPipe, DatePipe, JsonPipe, NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {CustomValidationDirective} from "./shared/CustomValidator";
import { ConfirmDialogComponent } from './modules/admin/expense/bill/bill-detail/confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {ListHistoryComponent} from "./UI-Elements/tables/history/list-history/list-history.component";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {ImageDirective} from "./shared/directive/image.directive";
import { CalendarComponent } from './modules/admin/leave/calendar/calendar.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';

import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    NgForOf,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    DatePipe,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgSwitch,
    NgSwitchCase,
    JsonPipe,
  ],
    declarations: [
        CustomValidationDirective,
        ConfirmDialogComponent,
        ListHistoryComponent,
        ImageDirective,
        CalendarComponent,
  ],
    providers: [],
    exports: [
        CustomValidationDirective,
        ListHistoryComponent,
        ImageDirective,
        CalendarComponent,
    ],
})
export class AppModule {

}
