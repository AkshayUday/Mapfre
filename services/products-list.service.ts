import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsListService {


  constructor(private http: HttpClient) { }

  productListService(zip) {
    const productCheckUrl = `${environment.nodeserver}products/productCheck?zipCode=${zip}`;
    return this.http.get(productCheckUrl);
  }

}
