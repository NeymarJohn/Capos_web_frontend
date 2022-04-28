import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { StoreConstants } from '@app/_configs/constant';
import * as UtilFunc from '@app/_helpers/util.helper';
import { APP_CONSTANTS } from '@app/_configs/constant';
import { Country } from '@app/_models/country';
import { Currency } from '@app/_models/currency';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  util = UtilFunc;
  public private_web_address:string = '';
  public isSpinnerVisible: boolean = false;
  public countries:Country[] = [];
  public currencies:Currency[] = [];
  
  constructor(
    private http: HttpClient,
    private titleService: Title
  ) {
    this.getCountries();
    this.getCurrencies();
  }

  setDocTitle(title: string) {    
    if(title){
      this.titleService.setTitle(title + ' - ' + APP_CONSTANTS.APP_TITLE);
    } else {
      this.titleService.setTitle(APP_CONSTANTS.APP_TITLE);
    }
  }

  getCurrentPrivateWebAddress() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      return user.private_web_address;
    }
    return null;
  }

  getUrl(uri): string {
    return APP_CONSTANTS.API_URL + uri;
  }

  post(uri, data): any {
    return this.http.post<any>(this.getUrl(uri), data, {observe: 'response'});
  }

  get(uri, data: any = {}): any {
    let httpParams = new HttpParams();
    Object.keys(data).forEach(key => {
      httpParams = httpParams.append(key, data[key]);
    });    

    if(!data.private_web_address) {
      let private_web_address = '';
      if(APP_CONSTANTS.IS_FRONT) {
        private_web_address = this.private_web_address;
      } else {
        private_web_address = this.util.getPrivateWebAddress() || this.getCurrentPrivateWebAddress();
      }      
      if(private_web_address) {
        httpParams = httpParams.append('private_web_address', private_web_address);        
      } else if(APP_CONSTANTS.IS_FRONT && !data.domain_name) {        
        httpParams = httpParams.append('domain_name', this.util.getDomain());
      }
    }
    return this.http.get<any>(this.getUrl(uri), {params: httpParams, observe: 'response'});
  }

  put(uri, data): any {
    return this.http.put(this.getUrl(uri), data, {observe: 'response'});
  }

  delete(uri): any {
    return this.http.delete(this.getUrl(uri),     {observe: 'response'});
  }

  uploadFile(files: any, success?:Function, error?:Function): void {
    const file = files[0];
    if (!file.type.includes('image')) {
      if(error) error(false);
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    this.post('util/file', formData).subscribe(result => {      
      if(success) success(result);
    }, err => {
      if(error) error(err);
    });
  }

  uploadFiles(files: any, success?:Function, error?:Function): void {    
    let f = false;
    const formData = new FormData();
    for(let i=0;i<files.length;i++) {
      const file = files[i];
      if(file.type.includes('image')) {
        f = true;
        formData.append('file', file);
      }
    }
    if(f) {      
      this.post('util/files', formData).subscribe(result => {        
        if(success) success(result);
      }, err => {
        if(error) error(err);
      });
    } else {
      if(error) error(false);
    }
  }

  deleteFile(path:any, success?:Function, error?:Function) {
    this.put('util/file', {path: path}).subscribe(result => {
      if(success) success(result)
    }, err => {
      if(error) error();
    })
  }
  
  get_csvfile(filename, errorCallback:any=null): any {    
    const uri = 'product/csv_file/' + filename;
    this.http.get(this.getUrl(uri), {observe: 'response', responseType: 'blob'}).subscribe(result => {
      if(result && result.body) {
        const blob = new Blob([result.body], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
        const url= window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;// you can take a custom name as well as provide by server
        a.click();
        // after certain amount of time remove this object!!!
        setTimeout( ()=> {
            URL.revokeObjectURL(url);
        }, 100);
      } else {
        if(errorCallback) errorCallback();
      }
    });
  }

  get_image(path) {
    return APP_CONSTANTS.SERVER_URL + path;
  }

  get_slider_image(path:string, index: number) {
    if(path) {
      const regex = /\\/ig;
      path = path.replace(regex, '/');
      return APP_CONSTANTS.SERVER_URL + path;
    } else {
      let id = index % 5 + 1;
      return 'assets/images/carousel/banner' + id + '.jpg';
    }
  }

  get_banner_image(path:string, index:number) {
    if(path) {
      const regex = /\\/ig;
      path = path.replace(regex, '/');
      return APP_CONSTANTS.SERVER_URL + path;
    } else {
      return StoreConstants.default_banner_images[index];
    }
  }

  getCountries() {
    this.get('auth/country', {}).subscribe(result => {
      for(let c of result.body) {
        this.countries.push({
          _id: c._id,
          country_code: c.country_code,
          country_name: c.country_name,
          currency_code: c.currency_code,
          iso_numeric: c.iso_numeric,
          capital: c.capital,
          continent_name: c.continent_name,
          continent: c.continent,
          languages: c.languages,
          geo_name_id: c.geo_name_id
        })
      }        
    });
  }

  getCurrencies() {
    this.get('util/currencies', {}).subscribe(result => {           
      for(let c of result.body) {
        this.currencies.push({
          _id: c._id,
          symbol: c.symbol,
          name: c.name,
          symbol_native: c.symbol_native,
          decimal_digits: c.decimal_digits,
          rounding: c.rounding,
          code: c.code,
          name_plural: c.name_plural
        })
      }
    }); 
  }
}