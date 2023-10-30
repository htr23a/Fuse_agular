import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {CalendarEvent} from "angular-calendar";
import moment from "moment";
import {Validators} from "@angular/forms";
import item from "../../../core/models/item";
import {addDays, addHours, endOfMonth, startOfDay, subDays} from "date-fns";
import {EventColor} from "calendar-utils";


const dataLeaveSummary = [
    {
        contact: {
            id: 1,
            name  : 'Brian Hughes',
            phone: '034 25 325 69',
            email : 'hughes.brian@company.com',
            avatar: 'assets/images/avatars/brian-hughes.jpg',
            status: 'online',
            number_days_off: 20,
            address     : '279 Independence Avenue, Calvary, Guam, PO4127',
            job: 'frontend'
        },
        pattern: 'Congé maladie',
        start_date: moment().startOf('month').toDate(),
        end_date:  moment().endOf('day').toDate(),
        status: 'VALID',
        user: {
            id: 156,
            name: 'Tino Harilala',
            phone: '034 27 237 74',
            email: 'tino@capsule.mg',
        },
    },
    {
        contact: {
            id: 2,
            name  : 'William Bell',
            phone: '034 25 325 69',
            email : 'William.Bell@company.com',
            avatar: 'assets/images/avatars/brian-hughes.jpg',
            status: 'online',
            number_days_off: 15,
            address     : '856 Woodside Avenue, Alfarata, Iowa, PO4992',
            job: 'product owner'
        },
        pattern: 'Mariage',
        start_date: moment().startOf('month').toDate(),
        end_date:  moment().endOf('day').toDate(),
        status: 'IN PROGRESS',
        user: {}
    },
    {
        contact: {
            id: 3,
            name  : 'Cheryl Obrien - HR',
            phone: '034 25 325 69',
            email : 'Cheryl.Obrien.HR@company.com',
            avatar: 'assets/images/avatars/brian-hughes.jpg',
            status: 'online',
            number_days_off: 17,
            address     : '943 Adler Place, Hamilton, South Dakota, PO5592',
            job: 'backend'
        },
        pattern: 'Vacances',
        start_date: moment().startOf('month').toDate(),
        end_date:  moment().endOf('day').toDate(),
        status: 'REJECT',
        user: {
            id: 156,
            name: 'Tino Harilala',
            phone: '034 27 237 74',
            email: 'tino@capsule.mg',
        }
    },
]
const History = [
    {
        contact_id: 1,
        id: 1,
        pattern: 'Congé maladie',
        start_date: 'Sun Oct 01 2023 00:00:00 GMT+0300',
        end_date:  'Mon Oct 02 2023 00:00:00 GMT+0300',
        status: 'VALID',
        user_name: 'Tino Harilala',
        days: 0
    },
    {
        contact_id: 1,
        id: 2,
        pattern: 'Congé payé',
        start_date: moment().startOf('month').toDate(),
        end_date:  moment().endOf('day').toDate(),
        status: 'REJECT',
        user_name: 'Tino Harilala',
        days: 0
    },
    {
        contact_id: 1,
        id: 3,
        pattern: 'Congé sabbatique',
        start_date: 'Mon Oct 15 2023 00:00:00 GMT+0300',
        end_date:  'Wen Oct 17 2023 00:00:00 GMT+0300',
        status: 'IN PROGRESS',
        user_name: 'Tino Harilala',
        days: 0
    },
    {
        contact_id: 2,
        id: 1,
        pattern: 'Congé de proche aidant',
        start_date: 'Sun Oct 01 2023 00:00:00 GMT+0300',
        end_date:  'Wen Oct 04 2023 00:00:00 GMT+0300',
        status: 'REJECT',
        user_name: 'Tino Harilala',
        days: 0
    },
    {
        contact_id: 3,
        id: 2,
        pattern: 'Congé Mariage de son enfant',
        start_date: 'Thi Oct 06 2023 00:00:00 GMT+0300',
        end_date: 'Fri Oct 07 2023 00:00:00 GMT+0300',
        status: 'VALID',
        user_name: 'Tino Harilala',
        days: 0
    }
]

const Contact = [
    {
        id: 1,
        name  : 'Brian Hughes',
        phone: '034 25 325 69',
        email : 'hughes.brian@company.com',
        avatar: 'assets/images/avatars/brian-hughes.jpg',
        status: 'online',
        number_days_off: 20,
        address     : '279 Independence Avenue, Calvary, Guam, PO4127',
        job: 'frontend'

    },
    {
        id: 2,
        name  : 'William Bell',
        phone: '034 25 325 69',
        email : 'William.Bell@company.com',
        avatar: 'assets/images/avatars/brian-hughes.jpg',
        status: 'online',
        number_days_off: 15,
        address     : '856 Woodside Avenue, Alfarata, Iowa, PO4992',
        job: 'product owner'

    },
    {
        id: 3,
        name  : 'Cheryl Obrien - HR',
        phone: '034 25 325 69',
        email : 'Cheryl.Obrien.HR@company.com',
        avatar: 'assets/images/avatars/brian-hughes.jpg',
        status: 'online',
        number_days_off: 17,
        address     : '943 Adler Place, Hamilton, South Dakota, PO5592',
        job: 'backend'
    }
]

@Injectable({
    providedIn: 'root'
})
export class LeaveService{
    private items: CalendarEvent[] = [];
    private itemsSubject: BehaviorSubject<CalendarEvent[]> = new BehaviorSubject(this.items);
    private start: Date
    private end: Date


    getItems(): Observable<CalendarEvent[]> {
        return this.itemsSubject.asObservable();
    }

    addItem(item: any) {
        this.items.push(item);
        console.log('add item')
        this.itemsSubject.next(this.items);
    }

    getSummary(){
        return dataLeaveSummary
    }

    getHistory( id: number) {
        this.calculateDateDifference()
        return History.filter(item => item.contact_id === id);
    }

    calculateDateDifference(startDate ?: Date, endDate ?: Date) {
        if(startDate && endDate){
            this.start = new Date(startDate)
            this.end = new Date(endDate)
            const timeDifference = this.start.getTime() - this.end.getTime()
            const daysDifference = timeDifference / (1000 * 3600 * 24);
            return Math.abs(Math.round(daysDifference));
        }
        else {
            History.forEach((element)=>{
                this.start = new Date(element.start_date)
                this.end = new Date(element.end_date)
                const timeDifference = this.start.getTime() - this.end.getTime()
                const daysDifference = timeDifference / (1000 * 3600 * 24);
                element.days = Math.abs(Math.round(daysDifference));
                this.start = null
                this.end = null
            })
        }
    }

    getContact(){
        return Contact
    }

    getContactByPk( id: number){
        return  Contact.find(user => user.id === id);
    }

}
