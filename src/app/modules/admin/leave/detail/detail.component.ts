import {Component, OnInit} from '@angular/core';
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {DatePipe, NgIf} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {LeaveService} from "../leave.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
    imports: [
        MatCardModule,
        MatTabsModule,
        DatePipe,
        MatTableModule,
        NgIf
    ],
    standalone: true
})
export class DetailComponent implements OnInit{
    dataHistory = [];
    displayedListColumns = ['description', 'start_date', 'end_date', 'number_day_off', 'action', 'user']
    Number_days_off
    constructor(private leaveService: LeaveService,
                private route: ActivatedRoute
                ) {
    }
    ngOnInit() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.dataHistory = this.leaveService.getHistory(id)
        console.log('data history',this.dataHistory)
    }
}
