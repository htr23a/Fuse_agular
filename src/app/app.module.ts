import {NgModule} from "@angular/core";
import {AsyncPipe, DatePipe, NgForOf} from "@angular/common";
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
import {FileAttachmentComponent} from "./UI-Elements/files/attachment/file-attachment/file-attachment.component";
import {FileUploadModule} from "ng2-file-upload";
import { GalleryModalComponent } from './UI-Elements/modals/gallery-modal/gallery-modal.component';
import {ImageDirective} from "./shared/directive/image.directive";
import { SearchComponent } from './modules/admin/expense/search/search.component';

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
    ],
    declarations: [
        CustomValidationDirective,
        ConfirmDialogComponent,
        ListHistoryComponent,
        ImageDirective
  ],
    providers: [],
  exports: [
    CustomValidationDirective,
    ListHistoryComponent,
    ImageDirective,
  ],
})
export class AppModule {

}
