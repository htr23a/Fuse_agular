import {Routes} from '@angular/router';
import {LeaveComponent} from "./leave.component";
import {DetailComponent} from "./detail/detail.component";

export default [
    {
        path: '',
        component: LeaveComponent
    },
    {
        path: 'detail/:id',
        component: DetailComponent
    }
] as Routes;

