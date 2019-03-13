
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as RouteActions from '../actions/route.actions';
import { Observable, of } from 'rxjs';
import { RouteService } from '../../core/services/route.service';
import { Action } from '@ngrx/store';
import { switchMap, catchError, map } from 'rxjs/operators';
@Injectable()
export class RouteEffect {
    constructor(private actions: Actions, private routeService: RouteService) {
    }
    @Effect()
    getRoutes$: Observable<Action> = this.actions.pipe(
        ofType(RouteActions.RouteActionTypes.GET_ROUTE), switchMap(() =>
            this.routeService.getRoutes().pipe(
                map(routes => new RouteActions.RouteSuccessAction(routes)),
                catchError(error => {
                    // of(new RouteActions.RouteFailureAction(error));
                    return this.routeService.getRoutesFromFallback().pipe(
                        map(routes => new RouteActions.RouteSuccessAction(routes)));
                })
            )
        )
    );
}
