import { Action } from '@ngrx/store';

export enum LeadActionTypes {
    SAVE_PNI = '[pni] save',
    SAVE_QUOTE = '[quote] save',
    ADD_DRIVER = '[driver] add',
    UPDATE_DRIVER = '[driver] update',
    ADD_VEHICLE = '[vehicle] add',
    UPDATE_VEHICLE = '[vehicle] update',
    DELETE_INCOMPLETE_DRIVER = '[incomplete driver] delete',
    DELETE_INCOMPLETE_VEHICLE = '[incomplete vehicle] delete',
    POST_LEAD = '[lead] post',
    POST_LEAD_SUCCESS = '[lead post] success',
    POST_LEAD_FAIL = '[lead post] fail',
    SAVE_MARKETING_DATA = '[market data] save',
    UPDATE_GENERATE_QUICK_QUOTE_PRICE_FLAG = '[generate quick quote price flag] update'
}

export class SavePNIData implements Action {
    readonly type = LeadActionTypes.SAVE_PNI;

    constructor(public payload: any) {
    }
}
export class SaveMarketingData implements Action {
    readonly type = LeadActionTypes.SAVE_MARKETING_DATA;

    constructor(public payload: any) {
    }
}
export class SaveQuote implements Action {
    readonly type = LeadActionTypes.SAVE_QUOTE;

    constructor(public payload: any) {
    }
}
export class AddDriver implements Action {
    readonly type = LeadActionTypes.ADD_DRIVER;

    constructor(public payload: any) {
    }
}
export class UpdateDriver implements Action {
    readonly type = LeadActionTypes.UPDATE_DRIVER;

    constructor(public payload: any) {
    }
}

export class AddVehicle implements Action {
    readonly type = LeadActionTypes.ADD_VEHICLE;

    constructor(public payload: any) {
    }
}
export class UpdateVehicle implements Action {
    readonly type = LeadActionTypes.UPDATE_VEHICLE;

    constructor(public payload: any) {
    }
}


export class DeleteIncompleteDriver implements Action {
    readonly type = LeadActionTypes.DELETE_INCOMPLETE_DRIVER;

    constructor() {
    }
}
export class DeleteIncompleteVehicle implements Action {
    readonly type = LeadActionTypes.DELETE_INCOMPLETE_VEHICLE;

    constructor() {
    }
}
export class PostLeadAction implements Action {
    readonly type = LeadActionTypes.POST_LEAD;

    constructor(public payload: any) {
    }
}
export class PostLeadSuccessAction implements Action {
    readonly type = LeadActionTypes.POST_LEAD_SUCCESS;
    constructor(public payload: any) {
    }

}
export class PostLeadFailureAction implements Action {
    readonly type = LeadActionTypes.POST_LEAD_FAIL;
    constructor(public payload: any) {
    }
}
export class UpdateGenerateQuickQuotePriceFlag implements Action {
    readonly type = LeadActionTypes.UPDATE_GENERATE_QUICK_QUOTE_PRICE_FLAG;

    constructor(public payload: any) {
    }
}
export type LeadActionsUnion = SavePNIData | AddDriver | UpdateDriver | AddVehicle | UpdateVehicle |
    PostLeadAction | PostLeadSuccessAction | PostLeadFailureAction | SaveQuote |
    DeleteIncompleteDriver | DeleteIncompleteVehicle | SaveMarketingData | UpdateGenerateQuickQuotePriceFlag;
