import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
    providedIn:'root'
})
export class CheckStatusRequiredService{
    private resetDataVendor = new Subject<boolean>()
    private resetDataContact = new Subject<boolean>()

    isReset$ = this.resetDataVendor.asObservable()
    isResetContact$ = this.resetDataContact.asObservable()


    Reset(status: boolean){
        this.resetDataVendor.next(status)
    }
    ResetContact(status: boolean){
        this.resetDataContact.next(status)
    }
}
