import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AppService} from "./app/app.service";

@Injectable({
  providedIn: 'root'
})
export class SettingsCompanyService {
    public static KEY = 'TS_COMPANY_SETTINGS';
  constructor(private http: HttpClient) { }

    getSettings(id: number, fields?: any[]) {
        const url = [AppService.API, 'companies', id, 'settings'].join('/');

        if (fields) {
            return this.http.post<any>(url, { fields });
        }
        else {
            return this.http.get<any>(url);
        }
    }
}
