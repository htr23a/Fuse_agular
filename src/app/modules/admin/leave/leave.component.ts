import { Component } from '@angular/core';
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {AppModule} from "../../../app.module";
import {DialogDetailComponent} from "./dialog-detail/dialog-detail.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddComponent} from "./dialog-add/dialog-add.component";
import {SummaryComponent} from "./summary/summary.component";

@Component({
    selector: 'app-leave',
    templateUrl: './leave.component.html',
    styleUrls: ['./leave.component.scss'],
    imports: [
        MatTabsModule,
        MatInputModule,
        ReactiveFormsModule,
        NgIf,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        AppModule,
        SummaryComponent,
    ],
    standalone: true
})
export class LeaveComponent {
    search = new FormControl('');

    constructor(
        public dialog: MatDialog
    ) {
    }

    // link calandar https://mattlewis-github.com/angular-calendar/#/kitchen-sink
    clearValue(){
        this.search.setValue('')
    }

    addEvent(){
        this.dialog.open(DialogAddComponent, {
            width: '600px',
        });
    }
}
