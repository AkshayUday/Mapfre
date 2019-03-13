import { Effect, ofType, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { LeadActionTypes, PostLeadSuccessAction, PostLeadFailureAction } from '../actions/lead.actions';
import { Observable, of } from 'rxjs';
import { LeadService } from '../../core/services/lead.service';
import { Action, Store } from '@ngrx/store';
import { switchMap, catchError, map } from 'rxjs/operators';
import { AppState } from '../reducers';
import * as LoaderActions from '../../store/actions/loader.actions';
import * as ErrorActions from '../../store/actions/error.actions';


@Injectable()
export class LeadEffects {
    constructor(private actions: Actions, private leadService: LeadService, private store: Store<any>) {
    }
    @Effect() saveLead$: Observable<Action> = this.actions.pipe(
        ofType(LeadActionTypes.POST_LEAD), switchMap((action) => {
            this.store.dispatch(new LoaderActions.StartLoaderAction());
            return this.leadService.saveLead(action).pipe(
                map(lead => {
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    if (lead['error'] === undefined) {
                        // this.store.dispatch(new ErrorActions.SetErrorAction({ code: null, message: null }));
                        return new PostLeadSuccessAction(lead);
                    } else {
                        // this.store.dispatch(new ErrorActions.SetErrorAction(lead['error']));
                        return new ErrorActions.SetErrorAction(lead['error']);
                    }
                }),
                catchError(error => {
                    this.store.dispatch(new LoaderActions.StopLoaderAction());
                    const customError = {
                        code: 600,
                        message: 'Service Failure/down'
                    };
                    return of(new ErrorActions.SetErrorAction(customError));
                })
            );
        }
        )
    );
}
