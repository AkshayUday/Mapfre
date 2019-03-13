import { ErrorActionTypes, ErrorActions } from '../actions/error.actions';
import { Action } from '@ngrx/store';
const initialRouteState = {
    code: '',
    message: ''
};
export function errorReducer(state = initialRouteState, action: ErrorActions) {
    switch (action.type) {
        case ErrorActionTypes.SET_ERROR:
            return {
                ...state, ...action.payload
            };
        default:
            return state;
    }
}
