import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import {SessionService} from "../../../core/services/session/session.service";
import {ImageService} from "../../../core/services/print/image.service";

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user',
    standalone     : true,
    imports        : [MatButtonModule, MatMenuModule, NgIf, MatIconModule, NgClass, MatDividerModule],
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;

    activeMenu: any

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private sessionService: SessionService,
        private imageService: ImageService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        //get active menu
        this.activeMenu = this.sessionService.getActiveMenu();
        this.loadImage()

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void
    {
        // Return if user is not available
        if ( !this.user )
        {
            return;
        }

        // Update the user
        this._userService.update({
            ...this.user,
            status,
        }).subscribe();
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }

    private loadImage() {
        //  BUS
        if (this.activeMenu.bus && this.activeMenu.bus.root) {
            console.log('load bus')
            this.imageService.localeImageToBase64('assets/images/bus/logo_cotisse.png', 'logo_cotisse');
            this.imageService.localeImageToBase64('assets/images/bus/logo_sonatra_plus.jpg', 'logo_sonatra_plus');
            this.imageService.localeImageToBase64('assets/images/bus/logo_classic.png', 'logo_classic');
            this.imageService.localeImageToBase64('assets/images/bus/logo_anjara.png', 'logo_anjara');
            this.imageService.localeImageToBase64('assets/images/bus/logo_wam.png', 'logo_wam');
            this.imageService.localeImageToBase64('assets/images/bus/logo_att.jpeg', 'logo_att');
            this.imageService.localeImageToBase64('assets/images/bus/logo_cpctrv.png', 'logo_cpctrv');
            this.imageService.localeImageToBase64('assets/images/bus/logo_maquauto.jpg', 'logo_maquauto');
        }

        //  MEN
        if (this.activeMenu.men && this.activeMenu.men.root) {
            console.log('load men')
            this.imageService.localeImageToBase64('assets/images/logo/logo_ministere_education.jpg', 'education');
            this.imageService.localeImageToBase64('assets/images/logo/logo_onapascoma.jpg', 'onapascoma');
            this.imageService.localeImageToBase64('assets/images/logo/logo_republique.jpg', 'republique');
        }

        //  HOTEL
        if (this.activeMenu.hotel && this.activeMenu.hotel.root) {
            console.log('load hotel')
            this.imageService.localeImageToBase64('assets/images/logo/logo_mvola.jpg', 'logo_mvola');
            this.imageService.localeImageToBase64('assets/images/logo/logo_om.jpg', 'logo_om');
            this.imageService.localeImageToBase64('assets/images/logo/logo_visa.png', 'logo_visa');
        }
    }
}
