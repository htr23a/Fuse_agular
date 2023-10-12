import {Routes} from '@angular/router';
import {SearchComponent} from "./search/search.component";

export default [
    {
        path: 'bill',
        loadChildren: ()=> import('app/modules/admin/expense/bill/bill.routes')
    },
    {
        path: 'search',
        component: SearchComponent,
    },

] as Routes;

