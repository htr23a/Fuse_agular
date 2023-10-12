import {Injectable} from "@angular/core";
import Bill from "../../models/bill";
import _cloneDeep from "lodash.clonedeep";
import {UtilityService} from "../utility/utility.service";
import _sumBy from 'lodash.sumby';
import _filter from 'lodash.filter';
import _groupBy from 'lodash.groupby';
import _forEach from 'lodash.foreach';
import {SessionService} from "../session/session.service";
import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {ImageService} from "./image.service";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Injectable({
    providedIn: "root"
})
export class PrintBillService{

    constructor(private utilityService: UtilityService,
                private sessionService: SessionService
                ) {
    }
    private buildTableBodyBill(bill, isGrouped?: boolean): Array<any> {
        const total_due = _sumBy(bill.BillItems, item => item.quantity * item.price);
        const table_body = [];
        const total_payment = _sumBy(bill.Payments, 'amount');
        const total_tax = _sumBy(bill.BillItems, (item) => item.quantity * item.tax);
        const balance = total_due + total_tax - total_payment;

        //  Table header
        table_body.push([
            {text: 'EXTRA', style: 'table-header', border: [false, true, false, false]},
            {text: 'QUANTITE', style: 'table-header', border: [false, true, false, false], alignment: 'center'},
            {text: 'PRIX', style: 'table-header', border: [false, true, false, false], alignment: 'right'},
            {text: 'TOTAL', style: 'table-header', border: [false, true, false, false], alignment: 'right'}
        ]);

        //  Table body
        const filteredItems = _filter(bill.BillItems, {item_id: 0});
        const filteredItemsId = _filter(bill.BillItems, item => item.item_id !== 0);

        if (isGrouped) {
            const groupedItems = _groupBy(filteredItemsId, item => item.item_id);

            _forEach(groupedItems, items => {
                let row: any;

                _forEach(items, (item, index) => {
                    if (index === 0) {
                        row = item;
                    }
                    else {
                        row['quantity'] += item.quantity;
                        row['total'] += item.total;
                    }
                });

                const meta = row.meta ? '\n' + row.meta : '';

                table_body.push([
                    {text: row.name + meta, style: 'table-cell'},
                    {text: row.quantity, style: 'table-cell', alignment: 'center'},
                    {text: this.utilityService.numberFormat(row.price), style: 'table-cell', alignment: 'right'},
                    {text: this.utilityService.numberFormat(row.quantity * row.price), style: 'table-cell', alignment: 'right'}
                ]);
            });
        }
        else {
            _forEach(filteredItemsId, item => {
                const meta = item.description ? '\n' + item.description : '';

                table_body.push([
                    {text: item.name + meta, style: 'table-cell'},
                    {text: item.quantity, style: 'table-cell', alignment: 'center'},
                    {text: this.utilityService.numberFormat(item.price), style: 'table-cell', alignment: 'right'},
                    {text: this.utilityService.numberFormat(item.quantity * item.price), style: 'table-cell', alignment: 'right'}
                ]);
            });
        }

        _forEach(filteredItems, item => {
            const meta = item.description ? '\n' + item.description : '';

            table_body.push([
                {text: item.name + meta, style: 'table-cell'},
                {text: item.quantity, style: 'table-cell', alignment: 'center'},
                {text: this.utilityService.numberFormat(item.price), style: 'table-cell', alignment: 'right'},
                {text: this.utilityService.numberFormat(item.quantity * item.price), style: 'table-cell', alignment: 'right'}
            ]);
        });

        //  Table payment summary
        table_body.push([
            {text: '', colSpan: 2, style: 'table-cell', border: [false, false, false, false]},
            '',
            {
                text: 'Sous Total :',
                style: 'table-cell',
                border: [false, false, false, true],
                bold: true
            },
            {
                text: (total_due),
                style: 'table-cell',
                border: [false, false, false, true],
                alignment: 'right'
            }
        ]);
        table_body.push([
            {text: '', colSpan: 2, style: 'table-cell', border: [false, false, false, false]},
            '',
            {
                text: 'Vignette :',
                style: 'table-cell',
                border: [false, false, false, true],
                bold: true
            },
            {
                text: this.utilityService.numberFormat(total_tax),
                style: 'table-cell',
                border: [false, false, false, true],
                alignment: 'right'
            }
        ]);
        table_body.push([
            {text: '', colSpan: 2, style: 'table-cell', border: [false, false, false, false]},
            '',
            {
                text: 'Payé :',
                style: 'table-cell',
                border: [false, false, false, true],
                bold: true
            },
            {
                text: this.utilityService.numberFormat(total_payment),
                style: 'table-cell',
                border: [false, false, false, true],
                alignment: 'right'
            }
        ]);
        table_body.push([
            {text: '', colSpan: 2, style: 'table-cell', border: [false, false, false, false]},
            '',
            {
                text: 'Total :',
                style: 'table-cell',
                border: [false, false, false, true],
                bold: true
            },
            {
                text: 'Ar ' + this.utilityService.numberFormat(balance),
                style: 'table-cell',
                border: [false, false, false, true],
                alignment: 'right', bold: true
            }
        ]);

        return table_body;
    }

    company: any = () => {
        return JSON.parse(sessionStorage.getItem('TS_COMPANY_SETTINGS'));
    };

    bill(b: Bill, isGrouped?: boolean) {
        const bill = _cloneDeep(b);
        const bill_number = bill.bill_number;
        const contact_phone = bill.Contact && bill.contact.phone ? this.utilityService.phoneFormat(bill.contact.phone) : '-';
        const vendor_phone = bill.Vendor ? this.utilityService.phoneFormat(bill.Vendor.phone) : null;

        const billContact = {
            phone: contact_phone,
            name: bill.Contact ? bill.contact.name : null,
            address: bill.Contact ? bill.contact.address : null
        };

        const bill_type =  'FACTURE';
        const table_body = this.buildTableBodyBill(bill, isGrouped);
        const connected_user = this.sessionService.getUser().name;

        const dd = {
            footer: {
                text: 'Imprimé ce ' + moment().format('DD MMM YYYY HH:mm') + ' par ' + connected_user,
                margin: [40, 0],
                fontSize: 9
            },
            pageSize: 'A4',
            watermark: {
                text: this.company().name,
                opacity: 0.04
            },
            content: [
                /*{
                    image: 'logo',
                    alignment: 'right',
                    width: 100,
                    margin: [0, 0, 14, 0]
                },*/
                {text: '', style: 'separator-xs'},
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 385, y1: 0,
                            x2: 487, y2: 0,
                            lineWidth: 1.2,
                        }
                    ]
                },
                {text: '', style: 'separator-xs'},
                {
                    columns: [
                        {
                            width: '*',
                            text: [
                                {text: 'Fournisseur\n'},
                                {text: `${bill.Vendor?.name || ''}\n`},
                                {text: (vendor_phone || '') + '\n'},
                                {text: (bill.Vendor?.address || '') + '\n'}
                            ],
                        }
                    ]
                },
                {
                    columns: [
                        {
                            width: '*',
                            text: [
                                {text: 'Contact\n'},
                                {text: (billContact.name || '') + '\n'},
                                {text: (billContact.phone || '') + '\n'},
                                {text: (billContact.address || '') + '\n'}
                            ],
                        },
                        {
                            width: 160,
                            text: [
                                {text: this.company().phone + '\n', alignment: 'center'},
                                {text: (this.company().address_1 || '') + '\n' + (this.company().address_2 || '') + '\n', alignment: 'center'},
                            ]
                        }
                    ]
                },
                {text: '', style: 'separator-xs'},
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 535, y2: 0,
                            lineWidth: 3
                        }
                    ]
                },
                {text: '', style: 'separator-xs'},
                {
                    text: bill_type + ' N° ' + bill_number,
                    bold: true,
                    fontSize: 12
                },
                {text: '', style: 'separator-xs'},
                {
                    style: 'table',
                    table: {
                        widths: ['*', 70, 100, 100],
                        headerRows: 1,
                        body: table_body
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            if (i === node.table.body.length - 2) {
                                return 0.2;
                            }

                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            if (i === 0 || i === node.table.widths.length) {
                                return 0;
                            }

                            return 1;
                        },
                        hLineColor: function (i, node) {
                            if (i === 0 || i === 1 || i === node.table.body.length
                                || i === (node.table.body.length - 1) || (i === node.table.body.length - 2)) {
                                return 'black';
                            }

                            return '#b3b5b7'; // gray light
                        },
                        vLineColor: function (i, node) {
                            return '#b3b5b7';
                        },
                        hLineStyle: function (i, node) {
                            if (i === 0 || i === 1 || i === node.table.body.length
                                || i === (node.table.body.length - 1)) {
                                return null;
                            }
                            return {dash: {length: 2}};
                        },
                        vLineStyle: function (i, node) {
                            if (i === 0 || i === node.table.widths.length) {
                                return null;
                            }
                            return {dash: {length: 2}};
                        }
                    }
                },
                {text: '', style: 'separator-sm'},
                {
                    text: '',
                    alignment: 'justify'
                },
                {
                    text: 'Signature et cachet',
                    alignment: 'right',
                    margin: [0, 30, 60, 0]
                }
            ],
            defaultStyle: {
                fontSize: 11
            },
            styles: {
                'separator-xs': {
                    margin: [0, 10]
                },
                'separator-sm': {
                    margin: [0, 20]
                },
                table: {
                    margin: 0
                },
                'table-header': {
                    bold: true,
                    margin: 7
                },
                'table-cell': {
                    margin: 7
                }
            },
            images: {
                logo: ImageService.logo
            }
        }
        pdfMake.createPdf(dd).print();
    }
}
