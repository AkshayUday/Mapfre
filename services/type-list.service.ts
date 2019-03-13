import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TypeListService {

  constructor(private httpClient: HttpClient) {

  }
  getMaritalStatusOptionsServer() {
    const url = environment.nodeserver + 'products/typeList?typeList=MaritalStatus';
    return this.httpClient.get(url);
  }
  getMaritalStatusOptionsFallBack() {
    const url = 'assets/data/marital_status.json';
    return this.httpClient.get(url);
  }
}
