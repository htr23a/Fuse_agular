import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }
    getToken = () => {
        return sessionStorage.getItem('token');
    };

    getCompanyId = () => {
        const company = this.getActiveCompany();
        return company ? parseInt(company.id) : null;
    }
    getActiveCompany = () => {
        const user = this.getUser();
        return user ? user.activeCompany : null;
    }
    getUser = () => {
        const session = this.getSession();
        return session ? session.user : null;
    };
    getSession() {
        try {
            const session = JSON.parse(sessionStorage.getItem('session'));

            if (!session) {
                // throw new Error('user disconnected!');
                return {};
            }

            return session;
        }
        catch (e) {
            console.log(e);
        }

        return {};
    }
  getActiveMenu = () => {
    const user = this.getUser();
    return user ? user.activeMenu[user.activeRoleIndex || 0] : null;
  }

  getUserExtra = (type: 'account_id' | 'location_id') => {
    const user = this.getUser();

    if (user.hasOwnProperty('extra') && user.extra) {
      if (user.extra.hasOwnProperty(type) && user.extra[type]) {
        return user.extra[type];
      }
    }

    return null;
  };

}
