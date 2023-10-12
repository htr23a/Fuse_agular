import {Routes} from '@angular/router';
import {BillComponent} from "./bill.component";
import {BillAddComponent} from "./bill-add/bill-add.component";
import {BillListComponent} from "./bill-list/bill-list.component";
import {BillDetailComponent} from "./bill-detail/bill-detail.component";

export default [
    {
        path: 'expenseList',
        component: BillComponent,
    },
    {
        path: 'add',
        component: BillAddComponent
    },
    {
        path: 'list',
        component: BillListComponent
    },
    {
        path: 'detail/:id',
        component: BillDetailComponent
    }
] as Routes;
