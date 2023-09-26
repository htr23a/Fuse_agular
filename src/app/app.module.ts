import {NgModule} from "@angular/core";
import {AsyncPipe, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {CustomValidationDirective} from "./shared/CustomValidator";

@NgModule({
    imports: [
        AsyncPipe,
        FormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        NgForOf,
    ],
    declarations: [
        CustomValidationDirective
  ],
    providers: [],
    exports: [
        CustomValidationDirective
    ],
})
export class AppModule {

}
