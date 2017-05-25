import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, XSRFStrategy, Request, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';
import { ApiRegistry } from './api.registry';
import { Cookie } from 'ng2-cookies/ng2-cookies';

const API_ROOT = environment.BACKEND_ENDPOINT_URI;
export const END_POINT = ApiRegistry;

@Injectable()
export class ApiService {
  constructor(private http: Http) { }

  get headers() {
    let _headers = new Headers();
    let options: RequestOptionsArgs;
    _headers.set('Content-Type', 'application/json');
    _headers.set('access-token', Cookie.get('accessToken'));
    _headers.set('uid', Cookie.get('uid'));
    _headers.set('client', Cookie.get('client'));
    _headers.set('X-XSRF-TOKEN', Cookie.get('XSRF-TOKEN'));
    options = { headers: _headers, withCredentials: true };
    return options;
  }

  get(endpoint: string[], params: any = {}) {
    return this.http.get(this.query(endpoint, params), this.headers)
      .map(this.extractNewData)
      .catch(this.handleError);
  }

  post(endpoint: string[], body) {
    return this.http.post(this.query(endpoint), body, this.headers)
      .map(this.extractNewData)
      .catch(this.handleError);
  }

  put(endpoint: string[], body) {
    return this.http.put(this.query(endpoint), body, this.headers)
      .map(this.extractNewData)
      .catch(this.handleError);
  }

  delete(endpoint: string[]) {
    return this.http.delete(this.query(endpoint), this.headers)
      .map(this.extractNewData)
      .catch(this.handleError);
  }

  query(endpoint: any[], params: any = {}): string {
    let param = new URLSearchParams();
    for (let slug in params) {
      param.set(slug, params[slug]); // ex: ?slug=value&slug2=value2
    }
    if (param.toString() != '') {
      return API_ROOT + endpoint.join('/') + '?' + param.toString();
    } else {
      return API_ROOT + endpoint.join('/');
    }
  }

  extractNewData(res: Response) {
    let data = res.json();
    return data;
  }

  handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: any;
    let status: number;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      status = error.status;

      if (status === 401 || status === 403) {
        Cookie.delete('currentUser');
        Cookie.deleteAll();
        location.reload();
      } else {
        errMsg = {
          status: status,
          message: body.message
        };
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
