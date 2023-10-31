import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LockScreenService{
    private checkToReset = new Subject()
    public checkToReset$ = this.checkToReset.asObservable()

    shardedToReset(status: boolean){
        this.checkToReset.next(status)
    }
}
