/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : 'expense',
        title: 'Dépenses',
        type : 'collapsable',
        icon : 'heroicons_outline:currency-euro',
        children: [
            {
                id: 'expenseList',
                title: 'Liste',
                type: 'basic',
                link : '/expense/bill/expenseList',
            },
            {
                id   : 'bill',
                title: 'Facturation',
                type : 'basic',
                link : '/expense/bill/list',
            },
            {
                id   : 'search',
                title: 'Recherche',
                type : 'basic',
                link : '/expense/search',
            }
        ]
    },
    {
        id: 'leave',
        title: 'Congé',
        type: 'basic',
        icon:'heroicons_solid:calendar-days',
        link: '/leave'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
