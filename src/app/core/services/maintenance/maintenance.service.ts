import {Injectable} from "@angular/core";
import {RequestHistory} from "../../models/request";
import {Observable} from "rxjs";
import {AppService} from "../app/app.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService{

    constructor(private httpClient: HttpClient) {
    }
    formatHistoryDescription(history: RequestHistory) {
        let description = '';

        // const translated = this.translateService.instant('status.' + history.status_code);
        const translated = (history.status_code)

        if (history.status_code === 'ADD' || history.status_code === 'REMOVE' || history.status_code === 'REMOVED') {
            try {
                const items = JSON.parse(history.description);

                for (let i = 0; i < items.length; i++) {
                    description += items[i].name + ' ('

                    if (history.status_code === 'REMOVE' || history.status_code === 'REMOVED') {
                        description += '-';
                    }

                    description += items[i].quantity + ')';

                    if (items.length > 1 && (i + 1) < items.length) {
                        description += ' - ';
                    }
                }
            }
            catch(e) {
                description = history.description;
            }
        }
        else if (/ADD_ITEM|REMOVE_ITEM/.test(history.status_code)) {
            if (history.meta) {
                description += history.meta.name + ' ('

                if (history.status_code === 'REMOVE_ITEM') {
                    description += '-';
                }

                description += history.meta.quantity + ')';
            }
            else {
                description = history.description;
            }

        }
        else if (/(CONTACT_CHANGE|STAFF_CHANGE:REMOVE|STAFF_CHANGE:ADD)/.test(history.status_code)) {
            let name = '';
            try {
                if (history.status_code === 'CONTACT_CHANGE') {
                    history.description = history.description.replace(/Previous contact : /g, '');
                }

                const parsed: any = JSON.parse(history.description);
                if (parsed.constructor === Array) {
                    if (parsed.length) {
                        name = parsed[0].name || '';
                    }
                    else {
                        name = '-';
                    }
                }
                else{
                    name = parsed.name || '';
                }
            }
            catch(err) {
                name = history.description;
            }

            if (history.status_code === 'CONTACT_CHANGE') {
                name = 'Précédent: ' + name;
            }

            description = `${history.status_code} - ${name}`;
        }
        else if (history.status_code === 'STATUS_UPDATE') {
            description = (`${history.description}`);
        }
        else if (history.status_code === 'EXTENDED_STATUS_UPDATE') {
            description = `${translated} - Précédent: ${(history.description || '-')}`;
        }
        else if (history.status_code === 'EXTENDED_TYPE_UPDATE') {
            description = `${translated} - Précédent: ${(history.description || '-')}`;
        }
        else {
            try {
                const data = JSON.parse(history.description);
                if (data.constructor === Array) {
                    data.forEach((prop, index) => {
                        description += this.joinObject(prop);

                        if (index < data.length - 1) {
                            description += ' | ';
                        }
                    });
                }
                else {
                    description  = this.joinObject(data);
                }
            }
            catch(err) {
                description = history.description;
            }
        }

        return description;
    }

    joinObject(o: object) {
        let out = '';
        const keys = Object.keys(o);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            out += k + ': ' + o[k];
            if (i < keys.length - 1) {
                out += ', ';
            }
        }

        return out;
    }

    addHistory(params): Observable<any> {
        const url = [AppService.API, 'requests', params['id'], 'note'].join('/');
        return this.httpClient.put<any>(url, params);
    }
}
