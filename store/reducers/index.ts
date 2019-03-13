import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  combineReducers
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { routeReducer } from './route.reducers';
import { leadReducer } from './lead.reducers';
import { loaderReducer } from './loader.reducers';
import { errorReducer } from './error.reducers';
export interface AppState {
}

export const reducers: ActionReducerMap<AppState> = {
  // 'QuoteStore': quoteReducer
  routes: routeReducer,
  lead: leadReducer,
  loader: loaderReducer,
  error: errorReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
