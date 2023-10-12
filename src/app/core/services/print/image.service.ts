import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  public static logo: string;
  //  Bus
  public static icon_arrow_up: string;
  public static icon_arrow_down: string;
  public static icon_driver: string;
  public static icon_insurance: string;
  public static icon_square: string;
  public static icon_square_full: string;
  public static icon_user: string;
  public static icon_long_arrow: string;
  public static logo_anjara: string;
  public static logo_att: string;
  public static logo_cotisse: string;
  public static logo_classic: string;
  public static logo_cpctrv: string;
  public static logo_maquauto: string;
  public static logo_sonatra_plus: string;
  public static logo_wam: string;
  // Hotel
  public static logo_mvola: string;
  public static logo_om: string;
  public static logo_visa: string;
  public static signature: string;
  //  Men
  public static education: string;
  public static onapascoma: string;
  public static republique: string;
  //

  constructor(
    private http: HttpClient,
  ) { }

  async localeImageToBase64(localPath: string, docname) {
    const headers = new HttpHeaders().set(
      'accept',
      'image / webp, image/*,*/ *; q = 0.8'
    );

    try {
      const res = await this.http
        .get(localPath, {headers, responseType: 'arraybuffer'})
        .toPromise();
      const blob = new Blob([res]);
      const reader = new FileReader();

      reader.readAsDataURL(blob);
      reader.onload = function () {
        ImageService[docname] = reader.result;
      };
    } catch (err) {
      console.log(err);
    }
  }
}
