import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView,
} from 'angular-calendar';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
} from 'date-fns';
import {EventColor} from 'calendar-utils';

import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {DialogDetailComponent} from "../dialog-detail/dialog-detail.component";
import {LeaveService} from "../leave.service";

const colors : Record<string, EventColor> = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
    },
};

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit{
    @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any>;

    view: CalendarView = CalendarView.Month;

    CalendarView = CalendarView;

    events: any

    viewDate: Date = new Date();

    activeDayIsOpen: boolean = true;

    modalData: {
        action: string;
        event: CalendarEvent;
    };


     Events : CalendarEvent[] = [
        {
            start: subDays(startOfDay(new Date()), 1),
            title: 'Congé de Marsh Cochran, motif : maladie',
            allDay: true,
            resizable: {
                beforeStart: true,
                afterEnd: true,
            },
            id: 1
        },
        {
            start: (new Date("Wen Oct 11 2023 00:00:00 GMT+0300")),
            end: (new Date("Mon Oct 15 2023 00:00:00 GMT+0300")),
            title: 'Congé de Marsh Cochran, motif : vacance',
            color: {...colors.blue},
            allDay: true,
            id: 3
        },
        {
            start: addHours(startOfDay(new Date()), 2),
            end: addHours(new Date(), 2),
            title: 'Congé de Laverne Dodson, motif : congé mariage de son enfant',
            color: {...colors.yellow},
            resizable: {
                beforeStart: true,
                afterEnd: true,
            },
            id: 2
        },
    ];

    /*actions: CalendarEventAction[] = [
        {
            label: '<i class="fas fa-fw fa-pencil-alt"></i>',
            a11yLabel: 'Edit',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            },
        },
        {
            label: '<i class="fas fa-fw fa-trash-alt"></i>',
            a11yLabel: 'Delete',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.events = this.events.filter((iEvent) => iEvent !== event);
                this.handleEvent('Deleted', event);
            },
        },
    ];*/


    refresh = new Subject<void>();



    constructor(
        // private modal: NgbModal
        public dialog: MatDialog,
        private leaveService: LeaveService
    ) {
    }

    ngOnInit() {
        this.leaveService.addItem(this.Events)
        this.leaveService.getItems().subscribe(
            (res)=>{
                this.events = res.flat()
                this.refresh.next()
            }
        )
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            }
            else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    eventTimesChanged({
      event,
      newStart,
      newEnd,
    }: CalendarEventTimesChangedEvent): void
    {
        this.events = this.events.map((iEvent) => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd,
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.dialog.open(DialogDetailComponent, {
            width: '800px',
            data: {
                modalData: {event, action},
            },
        });

    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

}
