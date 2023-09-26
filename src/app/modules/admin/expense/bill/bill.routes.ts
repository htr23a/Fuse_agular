import {Routes} from '@angular/router';
import {BillComponent} from "./bill.component";
import {BillAddComponent} from "./bill-add/bill-add.component";
import {BillListComponent} from "./bill-list/bill-list.component";

export default [
    {
        path: 'list',
        component: BillComponent,
    },
    {
        path: 'bill/add',
        component: BillAddComponent
    },
    {
        path: 'bill/list',
        component: BillListComponent
    }
] as Routes;
