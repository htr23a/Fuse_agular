import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import User from "../../../core/models/user";
import {MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthentificationService} from "../../../core/services/authentification/authentification.service";
import {Idle} from "@ng-idle/core";
import {LockScreenService} from "../../../core/lockScreen/lockScreen.service";

@Component({
    selector: 'app-lock-screen-modal',
    templateUrl: './lock-screen-modal.component.html',
    styleUrls: ['./lock-screen-modal.component.scss'],
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        NgIf,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule
    ],
    standalone: true
})
export class LockScreenModalComponent implements OnInit, AfterViewInit{
    user: User
    value: string
    lockForm: FormGroup
    submitted: boolean = false
    constructor(private formBuilder: FormBuilder,
                private authService: AuthentificationService,
                private idle: Idle,
                private dialog: MatDialog,
                private lockScreenService: LockScreenService
) {
    }
    ngAfterViewInit(): void {
        sessionStorage.removeItem('token');
    }
    ngOnInit(): void {
        this.initForm()
        const session: any = JSON.parse(sessionStorage.getItem('session'));
        this.user = session ? new User(session.user) : null;
    }

    initForm(){
        this.lockForm = this.formBuilder.group({
            password: [null, Validators.required]
        })
    }
    signIn() {
        this.submitted = true;

        if (this.lockForm.valid) {
            const email = this.user.email;
            const password = this.lockForm.controls['password'].value;

            this.authService.login(email, password)
                .toPromise()
                .then(res => {
                    if (res && res['token']) {
                        sessionStorage.setItem('token', res['token']);
                        sessionStorage.setItem('session', JSON.stringify({
                            user: res['user'],
                            config: res['config']
                        }));
                        this.dialog.closeAll()
                        this.idle.watch();
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        }
        else {
            console.log('FORM_NOT_VALID')
        }
    }

    logout() {
        this.authService.logout();
        this.dialog.closeAll();
        this.lockScreenService.shardedToReset(true);
    }
}
