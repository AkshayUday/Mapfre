import { RouteActionTypes, RouteActions } from '../actions/route.actions';
import { Action } from '@ngrx/store';
const initialRouteState = {
    routes: []
};
export function routeReducer(state = initialRouteState, action: RouteActions) {
    switch (action.type) {
        case RouteActionTypes.ROUTE_SUCCESS:
            return {
                ...state, routes: action.payload.filter(item => item.visible === true)
            };
        default:
            return state;
    }
}
