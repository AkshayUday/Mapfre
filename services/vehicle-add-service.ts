import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VehicleAddService {

  constructor(private httpClient: HttpClient) { }

  getVehicleYear() {
    const url = environment.nodeserver + 'util/vehicleYear';
    return this.httpClient.get(url);
  }
  getVehicleMake(year) {
    const url = environment.nodeserver + 'polk/make?year=' + year;
    return this.httpClient.get(url);
  }
  getVehicleModel(year, make) {
    const url = environment.nodeserver + 'polk/model?make=' + make + '&year=' + year;
    return this.httpClient.get(url);
  }
  getVehicleTrim(year, make, model) {
    const url = environment.nodeserver + 'polk/vinPrefix?year=' + year + '&make=' + make + '&model=' + model;
    return this.httpClient.get(url);
  }
}
