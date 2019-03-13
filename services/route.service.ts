import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route } from '../../store/models/route.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RouteService {

    constructor(private httpClient: HttpClient) { }

    getRoutes(): Observable<Route[]> {
        // return this.httpClient.get<Route[]>('https://e3720115-3cf4-473e-b840-b11b1f9b0c08.mock.pstmn.io/route');
        // return this.httpClient.get<Route[]>('assets/data/routes.json');
        // return this.httpClient.get<Route[]>(environment.nodeserver + 'routes');
        // return this.httpClient.get('http://localhost:57001/routes');
        // return this.httpClient.get<Route[]>('assets/data/routes.json');
        return this.httpClient.get<Route[]>(environment.nodeserver + 'routes');
        // return this.httpClient.get('http://localhost:57001/routes');
    }
    getRoutesFromFallback() {
        return this.httpClient.get<Route[]>('assets/data/routes.json');
    }
}
