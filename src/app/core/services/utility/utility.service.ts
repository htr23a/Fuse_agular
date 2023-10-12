import {Injectable} from "@angular/core";
import {AppService} from "../app/app.service";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";


@Injectable({
    providedIn:'root'
})
export class UtilityService{
    constructor(
      private http: HttpClient
    ) {}

    numberFormat(number): string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    phoneFormat(phone): string {
        if (phone) {
            const regex = /(\d{3})(\d{2})(\d{3})(\d{2})/;
            return phone.replace(regex, '$1 $2 $3 $4');
        } else {
            return '';
        }
    }
    downloadFile(doc: any, docType: string = 'documents', suffix?: string) {
        const url = [AppService.API, 'static', docType, doc.doc_id].join('/');

        return this.http.get(url, {responseType: 'arraybuffer'}).pipe(
          tap(buffer => {
              const type = doc.doc_mime ? doc.doc_mime : '';
              const url = URL.createObjectURL(new Blob([buffer], {type}));
              const link = document.createElement('a');
              link.href = url;

              let name = doc.doc_name || '';

              if (suffix) {
                  name += '_' + suffix;
              }

              if (name) {
                  link.setAttribute('download', name);
              }

              link.setAttribute('target', 'blank');
              link.click();
              link.remove();
          })
        );

    }
    statusStyle = (status) => {
        const style = {
            color: 'white',
            background: 'danger',
            valuenow: 100,
            width: '100%'
        };

        switch (status) {
            case 'REJECTED':
            case 'CANCELED':
                style.background = 'default';
                style.color = 'dark';
                style.valuenow = 0;
                style.width = '0%';
                break;
            case 'VOIDED':
                style.background = 'default';
                style.color = 'dark';
                style.valuenow = 0;
                style.width = '0%';
                break;
            case 'REFUNDED':
                style.background = 'default';
                style.color = 'dark';
                style.valuenow = 0;
                style.width = '0%';
                break;
            case 'OPEN':
                style.background = 'blue';
                style.color = 'white';
                style.valuenow = 10;
                style.width = '10%';
                break;
            case 'SENT':
                style.background = 'green';
                style.color = 'white';
                style.valuenow = 20;
                style.width = '20%';
                break;
            case 'APPROVED':
                style.background = 'red';
                style.color = 'white';
                style.valuenow = 25;
                style.width = '25%';
                break;
            case 'IN_PROGRESS':
                style.background = 'gray';
                style.color = 'white';
                style.valuenow = 50;
                style.width = '50%';
                break;
            case 'ON_HOLD':
                style.background = 'gold';
                style.color = 'dark';
                style.valuenow = 75;
                style.width = '75%';
                break;
            case 'PARTIAL':
                style.background = 'amber';
                style.color = 'dark';
                style.valuenow = 50;
                style.width = '50%';
                break;
            case 'RECEIVED':
                style.background = 'gray';
                style.color = 'white';
                style.valuenow = 100;
                style.width = '100%';
                break;
            case 'PAID':
                style.background = 'green';
                style.color = 'white';
                style.valuenow = 100;
                style.width = '100%';
                break;
            case 'COMPLETED':
                style.background = 'green';
                style.color = 'white';
                style.valuenow = 100;
                style.width = '100%';
                break;
            default:  //  DRAFT
                style.background = 'red';
                style.color = 'white';
                style.valuenow = 100;
                style.width = '100%';
                break;
        }

        return style;
    };
    getUploadUrl = (id: any, type: 'CONTACT' | 'COMPANY' | 'USER' | 'ATTACHMENT', route?: string) => {
        let path = null;

        if (type === 'CONTACT') path = `contacts/${id}/photo`;
        else if (type === 'COMPANY') path = `companies/${id}`;  //  logo or signature
        else if (type === 'USER') path = `users/${id}/photo`;
        else if (type === 'ATTACHMENT') path = `${route}/${id}/attachment`;
        else path = null;

        const fullPath = [AppService.API, path].join('/');
        // console.log('[uploadUrl] ', fullPath);

        return fullPath;
    };
}
