import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DEFAULT_INTERRUPTSOURCES, Idle, IdleExpiry, NgIdleModule} from "@ng-idle/core";
import {Keepalive, NgIdleKeepaliveModule} from "@ng-idle/keepalive";
import {SessionService} from "./core/services/session/session.service";
import {AppModule} from "./app.module";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        RouterOutlet,
        AppModule,
    ],
    standalone: true
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor(
        private idle: Idle,
        private keepalive: Keepalive,
        private sessionService: SessionService
    )
    {
        this.initIdle()
    }

    private initIdle() {
        // sets an idle timeout of 90 seconds.
        this.idle.setIdle(150);
        // sets a timeout period of 5 seconds. after 90 seconds of inactivity, the user will be considered timed out.
        this.idle.setTimeout(5);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.idle.onIdleStart.subscribe(() => {
            // console.log('You\'ve gone idle!');
        });
        this.idle.onIdleEnd.subscribe(() => {
            // console.log('No longer idle.');
        });
        this.idle.onTimeout.subscribe(() => {
            console.log('Timed out!');

            if (this.sessionService.getToken()) {
                /*const modalRef = this.ngbModal.open(LockScreenComponent, {
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    windowClass: 'img-preview'
                });*/
            }
            else {
                // console.log('Timed out . Not logged in !');
            }
        });
        this.idle.onTimeoutWarning.subscribe(countdown => {
            // console.log('You will time out in ' + countdown + ' seconds!')
        });

        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);

        this.keepalive.onPing.subscribe(() => {
            // console.log(moment().format('YYYY-MM-DD HH:mm'));
        });
    }
}
