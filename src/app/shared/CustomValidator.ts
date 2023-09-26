import {Directive, Input} from "@angular/core";
import { FormGroup, NG_VALIDATORS, Validator} from "@angular/forms";

@Directive({
    selector: '[isValidate]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: CustomValidationDirective,
            multi: true,
        },
    ],
})
export class CustomValidationDirective implements Validator {
    constructor() {
    }

    validate(formGroup: FormGroup): { [key: string]: any } | null {
        const vendorInput = formGroup.get('vendor');
        const contactInput = formGroup.get('contact');


        if (!vendorInput.value && !contactInput.value) {
            return {customValidation: true};
        }
        return null;
    }
}
