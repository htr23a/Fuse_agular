import {Injectable} from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class UtilityService{
    constructor() {}

    numberFormat(number): string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    phoneFormat(phone): string {
        if (phone) {
            const regex = /(\d{3})(\d{2})(\d{3})(\d{2})/;
            return phone.replace(regex, '$1 $2 $3 $4');
        } else {
            return '';
        }
    }
}
