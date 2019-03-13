import { LoaderActionTypes, LoaderActions } from '../actions/loader.actions';
const initialRouteState = {
    isLoading: false
};
export function loaderReducer(state = initialRouteState, action: LoaderActions) {
    switch (action.type) {
        case LoaderActionTypes.START_LOADER:
            return {
                ...state, isLoading: true
            };
            break;
        case LoaderActionTypes.STOP_LOADER:
            return {
                ...state, isLoading: false
            };
            break;
        default:
            return state;
    }
}
