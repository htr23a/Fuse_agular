import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core";
import {Keepalive} from "@ng-idle/keepalive";
import {SessionService} from "../core/services/session/session.service";
import {MatDialog} from "@angular/material/dialog";
import User from "../core/models/user";
import {LockScreenModalComponent} from "../UI-Elements/modals/lock-screen-modal/lock-screen-modal.component";
import {LockScreenService} from "../core/lockScreen/lockScreen.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit, OnDestroy{

    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    subscription = new Subscription()
    constructor(
        private idle: Idle,
        private keepalive: Keepalive,
        private dialog: MatDialog,
        private sessionService: SessionService,
        private lockScreenService: LockScreenService,
        private route: Router
    ) {
        this.initIdle()
        this.reset();
        this.subscription.add(
            this.lockScreenService.checkToReset$.subscribe(
                (res: boolean)=>{
                    if (res) {
                        this.reset()
                    }
                }
            )
        )
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }

    initIdle(){
        this.idle.setIdle(360);
        this.idle.setTimeout(20);
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
        this.idle.onTimeout.subscribe(() => {
             if(this.sessionService.getToken()){
                this.OpenDialog()
                this.idleState = 'Timed out!';
                this.timedOut = true;
            }
             else {
                 console.log('token not set')
                 this.reset()
            }

        });
        this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
        this.idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);

        this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
    }
    reset() {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
    }

    ngOnInit() {
        console.log('parent init')
    }


    OpenDialog() {
        let dialogRef = this.dialog.open(LockScreenModalComponent, { disableClose: true, panelClass: ['no-padding', 'no-scrolls'], });
        dialogRef.afterOpened().subscribe(() => {
            dialogRef.keydownEvents().subscribe((event: KeyboardEvent) => {
                if (event.key === ' ' || event.code === 'Space') {
                    event.preventDefault();
                }
            });
        });
    }


}
