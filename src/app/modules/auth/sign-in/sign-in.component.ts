import {NgIf} from '@angular/common';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertComponent, FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/core/auth/auth.service';
import {environment} from "../../../../environments/environment";
import {AuthentificationService} from "../../../core/services/authentification/authentification.service";
import {QueueService} from "../../../core/services/queue/queue.service";
import {NotificationsService} from "../../../layout/common/notifications/notifications.service";
import {AppService} from "../../../core/services/app/app.service";

/*import {AngularFireAuth} from '';*/
@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    submitted: boolean;
    api: string;
    display_id: string;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private authService: AuthentificationService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private formBuilder: FormBuilder,
        private router: Router,
        private QueueService: QueueService,
        private notification: NotificationsService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
   /* ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, Validators.required]
        });
    }*/

    ngOnInit(): void {
        this.api = AppService.API;
        this.display_id = localStorage.getItem('DISPLAY_ID');
        this.signInForm = this._formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, Validators.required],
            api: [
                this.api || null,
                Validators.required
            ],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    /*signIn() {
        this.submitted = true;

        if (this.signInForm.valid) {
            const formValue = this.signInForm.value;

            AppService.API = `${formValue.api}`;


            this.authService.login(formValue.email, formValue.password)
                .toPromise()
                .then(res => {
                    if (res && res['token']) {
                        const user = res['user'];

                        user.activeRoleIndex = 0;

                        sessionStorage.setItem('token', res['token']);
                        sessionStorage.setItem('session', JSON.stringify({
                            user: user,
                            config: res['config']
                        }));

                        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                        this._router.navigateByUrl(redirectURL)
                    }
                })
                .catch(err => {
                    this.showAlert = true
                    this.alert = {
                        type: 'error',
                        message: 'Email ou mot de passe invalide',
                    };
                });
        }
        else {
            this.notification.error(null, 'FORM_NOT_VALID');
        }
    }*/
    signIn() {
        this.submitted = true;

        if (this.signInForm.valid) {
            const formValue = this.signInForm.value;


            AppService.API = `${formValue.api}`;

            this.authService.login(formValue.email, formValue.password)
                .toPromise()
                .then(res => {
                    if (res && res['token']) {
                        const user = res['user'];

                        user.activeRoleIndex = 0;

                        sessionStorage.setItem('logedIn', 'loged')
                        sessionStorage.setItem('token', res['token']);
                        sessionStorage.setItem('session', JSON.stringify({
                            user: user,
                            config: res['config']
                        }));

                        /*let layout = 'bus'; // Par défaut
                        if (formValue.api === 'https://api.capsule.mg/pascoma') {
                        layout = 'hotel';
                        }

                        this.setLayout(layout)*/

                        /*Swal.fire({
                            toast: true,
                            position: 'top',
                            showConfirmButton: false,
                            showClass: {
                                backdrop: 'swal2-noanimation',
                                popup: '',
                                icon: ''
                            },
                            timer: 9000,
                            title: 'Success!',
                            text: 'Vous etes Authentifier',
                            icon: 'success',
                        });*/

                        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                        this._router.navigateByUrl(redirectURL);
                    }
                })
                .catch(err => {
                    if (err.status == 400) {
                        this.alert = {
                            type: 'error',
                            message: 'Compte introuvable'
                        };
                    }
                    if (err.status == 500) {
                        this.alert = {
                            type: 'error',
                            message: 'Mot de passe incorrect'
                        };
                    }
                    this.showAlert = true;
                });
        }
        else {
            /*Swal.fire({
                toast: true, position: 'top',
                title: 'Attention',
                text: 'Form non valider',
                icon: 'warning', showConfirmButton: false, timer: 3000,
            })*/
        }
    }

}
