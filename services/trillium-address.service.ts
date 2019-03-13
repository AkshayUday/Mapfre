import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrilliumAddressService {

  constructor(private http: HttpClient) {}


  putTrilliumAddress(data) {
    const url = `${environment.nodeserver}address`;
    return this.http.put(url, data);
  }
}
