import {Component, Inject, OnInit} from '@angular/core';
import {JsonPipe} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";

@Component({
    selector: 'app-dialog-reject',
    templateUrl: './dialog-reject.component.html',
    styleUrls: ['./dialog-reject.component.scss'],
    imports: [
        JsonPipe,
        MatButtonModule,
        MatDialogModule,
        MatInputModule
    ],
    standalone: true
})
export class DialogRejectComponent implements OnInit{
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        console.log(this.data.selectedItem)
    }
}
