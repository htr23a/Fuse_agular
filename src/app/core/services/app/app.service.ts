import { Injectable } from '@angular/core';
import moment from "moment";
import {PaymentMethod} from "../../models/payment-method";
import _orderBy from 'lodash.orderby';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }
    public static set API(value: string) {
        localStorage.setItem('API', value);
    };
    public static get API() {
        return localStorage.getItem('API');
    }

  public static CHANNELS = ['STORE', 'PHONE', 'EMAIL', 'OTHER'];
  public static DEFAULT_CURRENCY = 'MGA';
  public static DEFAULT_IMAGE = 'assets/images/p0.jpg';
  public static DEFAULT_LOGO = 'assets/images/logo/logo_tokotaniko.png';
  public static EVENT_TYPES = ['OFFENSE', 'NOTE', 'CONTRIBUTION'];
  public static ITEM_TYPES = ['ASSET', 'BUS_SEAT', 'EXCESS_LUGGAGE', 'GOODS', 'PACKAGE', 'ROOM', 'SERVICES', 'VEHICLE_PART'];
  public static VEHICLE_CATEGORY = ['VIP', 'PREMIUM', 'ECONOMY', 'CLASSIC', 'FOURGON', 'BOEING', 'MINI-BUS', 'STANDARD', 'PRIVILEGE', 'OTHER'];

    getBillCode = () => {
        return 'BILL-' + moment().valueOf();
    }


    paymentMethods: PaymentMethod[] = _orderBy([
        {
            code: 'CASH',
            name: 'Espèce',
            order: 1,
            description: 'Cash'
        },
        {
            code: 'CHECK',
            name: 'Chèque',
            order: 2,
            description: 'Check'
        },
        {
            code: 'CREDIT_CARD',
            name: 'Carte crédit',
            order: 4,
            description: 'Credit card'
        },
        {
            code: 'WIRE_TRANSFER',
            name: 'Virement bancaire',
            order: 5,
            description: 'Wire transfer'
        },
        {
            code: 'MVOLA',
            name: 'MVola',
            order: 6,
            description: 'MVola'
        },
        {
            code: 'ORANGE_MONEY',
            name: 'Orange money',
            order: 7,
            description: 'Orange money'
        },
        {
            code: 'AIRTEL_MONEY',
            name: 'Airtel money',
            order: 8,
            description: 'Airtel money'
        },
        {
            code: 'MONEY_ORDER',
            name: 'Western Union',
            order: 9,
            description: 'Western Union'
        },
        {
            code: 'BNI_PAY',
            name: 'BNI P@Y',
            order: 10,
            description: 'BniPay'
        },
        {
            code: 'SP',
            name: 'SP',
            order: 11,
            description: 'Spécial / Service Patron'
        },
        {
            code: 'REWARD',
            name: 'Récompense',
            order: 12,
            description: 'Récompense fidélité'
        }
    ], ['name'], ['asc']);
}
