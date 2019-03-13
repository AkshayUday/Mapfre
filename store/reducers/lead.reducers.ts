import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import * as LeadActions from '../actions/lead.actions';

import {
  Lead,
  QuickQuote
} from '../models/lead.model';
import {
  isNgTemplate
} from '@angular/compiler';
export type Action = LeadActions.LeadActionsUnion;
const today = new Date();
export const initialState = {
  leadID: null,
  publicID: null,
  sessionUUID: null,
  genderCode: '',
  genderValue: '',
  maritalStatusCode: '',
  maritalStatusValue: '',
  primaryAddress: {
    publicID: null,
    addressLine1: '',
    addressLine2: null,
    cantFindAddress: false,
    city: '',
    state: '',
    zipCode: '',
    county: '',
    country: '',
    // timeAtCurrentResidenceExt: '',
    timeAtCurrentResidenceCode: '',
    timeAtCurrentResidenceValue: '',
    isAddressVerified: false,
  },
  priorAddress: {
    publicID: null,
    addressLine1: '',
    addressLine2: null,
    cantFindAddress: false,
    city: '',
    state: '',
    zipCode: '',
    county: '',
    country: '',
    isAddressVerified: false
  },
  primaryEmailAddress: '',
  phoneNumber: '',
  quickQuote: {
    quickQuoteNumber: null,
    drivers: [],
    vehicles: [],
    periodStartDate: {
      year: '',
      month: '',
      day: '',
    },
    periodEndDate: {
      year: '',
      month: '',
      day: '',
    },
    monthlyPremiumPrice: null,
    fullTermPremiumPrice: null,
    policyTerm: '',
    whatToDo: {
      eligible: '',
      referToPA: '',
      knockOut: '',
    },
    quoteStatus: null,
    recordStatus: {
      statusCode: '',
      statusMessage: ''
    }
  },
  quote: {
    quoteNumber: null,
    quoteStatus: null,
    isADPFQuote: false,
    eligibilityAnswers: {
      ineligibleVehicle: '',
      majorViolations: '',
      licenseRevoked: ''
    }
  },
  // urlParams:{
  //     zipCode: null
  // },
  marketingData: {
    campaignID: null,
    leadSource: null,
    currentURL: null,
    referringURL: null,
    zipCode: null
  }
};

export function leadReducer(state = initialState, action: Action) {
  switch (action.type) {
    case LeadActions.LeadActionTypes.SAVE_PNI:
      return saveDetails(state, action.payload);
      break;
    // case LeadActions.LeadActionTypes.ADD_DRIVER:
    //     return { ...state, ...state['lead'], quickQuote: driverReducer(state['lead']['quickQuote']['drivers'], action) };
    case LeadActions.LeadActionTypes.ADD_DRIVER:
      return {
        ...state,
        quickQuote: {
          ...state.quickQuote,
          drivers: [...state.quickQuote.drivers, action.payload]
        }
      };
      break;
    case LeadActions.LeadActionTypes.UPDATE_DRIVER:
      return updateDriver(state, action.payload);
      break;

    case LeadActions.LeadActionTypes.ADD_VEHICLE:
      return {
        ...state,
        quickQuote: {
          ...state.quickQuote,
          vehicles: [...state.quickQuote.vehicles, action.payload]
        }
      };
      break;
    case LeadActions.LeadActionTypes.UPDATE_VEHICLE:
      return updateVehicle(state, action.payload);
      break;

    case LeadActions.LeadActionTypes.DELETE_INCOMPLETE_DRIVER:
      return deleteIncomplteDriver(state);
      break;
    case LeadActions.LeadActionTypes.DELETE_INCOMPLETE_VEHICLE:
      return deleteIncomplteVehicle(state);
      break;
    case LeadActions.LeadActionTypes.POST_LEAD_SUCCESS:
      return createLead(state, action.payload);
      break;
    case LeadActions.LeadActionTypes.SAVE_QUOTE:
      return saveQuote(state, action.payload);
      break;
    case LeadActions.LeadActionTypes.SAVE_MARKETING_DATA:
      return saveMarketingData(state, action.payload);
      break;
    case LeadActions.LeadActionTypes.UPDATE_GENERATE_QUICK_QUOTE_PRICE_FLAG:
      return updateGenerateQuickQuotePriceFlag(state, action.payload);
      break;
    default:
      return state;
  }
}

function saveDetails(state, payload) {
  return {
    ...state,
    ...state.lead,
    ...payload
  };
}

function updateDriver(state, payload) {
  const updatedDrivers = state.quickQuote.drivers.map(item => {
    if (item.driverID === payload.driverID) {
      return {
        ...item,
        ...payload
      };
    }
    return item;
  });

  const driversObj = {
    ...state.quickQuote.drivers,
    ...updatedDrivers
  };
  const driversArr = Object.keys(driversObj).map((k) => driversObj[k]);
  return {
    ...state,
    quickQuote: {
      ...state.quickQuote,
      drivers: driversArr
    }
  };

}

function updateVehicle(state, payload) {
  const updatedVehicles = state.quickQuote.vehicles.map(item => {
    if (item.vehicleID === payload.vehicleID) {
      return {
        ...item,
        ...payload
      };
    }
    return item;
  });

  const vehiclesObj = {
    ...state.quickQuote.vehicles,
    ...updatedVehicles
  };
  const vehiclesArr = Object.keys(vehiclesObj).map((k) => vehiclesObj[k]);
  return {
    ...state,
    quickQuote: {
      ...state.quickQuote,
      vehicles: vehiclesArr
    }
  };
}

function createLead(state, payload) {
  return {
    ...state,
    ...payload.lead
  };
}

function addDriver(state, payload) {
  return {
    drivers: [state.drivers, payload]
  };
}

function addVehicle(state, payload) {
  return {
    vehicles: [state.vehicles, payload]
  };
}

function deleteIncomplteDriver(state) {
  // const index = state.quickQuote.drivers.findIndex(driver => Object.keys(driver).length === 3);
  // if (index > -1) {
  //     state.quickQuote.drivers.splice(index, 1);
  //     return { ...state, quickQuote: { ...state.quickQuote, drivers: state.quickQuote.drivers } };
  // } else { return state; }
  const index = state.quickQuote.drivers.findIndex(driver => !driver.isADPF && !driver.isAlreadyIncluded);
  if (index > -1) {
    state.quickQuote.drivers.splice(index, 1);
    return {
      ...state,
      quickQuote: {
        ...state.quickQuote,
        drivers: state.quickQuote.drivers
      }
    };
  } else {
    return state;
  }
}

function deleteIncomplteVehicle(state) {
  // const index = state.quickQuote.vehicles.findIndex(vehicle => Object.keys(vehicle).length === 3);
  const index = state.quickQuote.vehicles.findIndex(vehicle => !vehicle.isADPF && !vehicle.isAlreadyIncluded);
  if (index > -1) {
    state.quickQuote.vehicles.splice(index, 1);
    return {
      ...state,
      quickQuote: {
        ...state.quickQuote,
        vehicles: state.quickQuote.vehicles
      }
    };
  } else {
    return state;
  }
}

function saveQuote(state, payload) {
  return {
    ...state,
    quote: {
      ...state.quote,
      ...payload
    }
  };
}
export function saveMarketingData(state, payload) {
  return {
    ...state,
    marketingData: {
      ...state.marketingData,
      ...payload
    }
  };
}
export function updateGenerateQuickQuotePriceFlag(state, payload) {
  return {
    ...state,
    ...payload
  };
}
export const leadSelector = (appState) => appState.lead;
export const primaryAddress = createSelector(leadSelector, (leadState: Lead) => leadState.primaryAddress);
export const priorAddress = createSelector(leadSelector, (leadState: Lead) => {
  if (leadState.priorAddress) {
    return leadState.priorAddress;
  }
});
export const quickQuoteSelector = createSelector(leadSelector, (leadState: Lead) => leadState.quickQuote);
export const quoteSelector = createSelector(leadSelector, (leadState: Lead) => leadState.quote);

export const drivers = createSelector(leadSelector, (leadState: Lead) => {
  if (leadState.quickQuote && leadState.quickQuote.drivers) {
    return leadState.quickQuote.drivers;
  }
});
export const driverCount = createSelector(quickQuoteSelector, (quickQuote) => quickQuote.drivers.length);
export const selectedDriver = (driverId) => createSelector(quickQuoteSelector,
  (quote) => quote.drivers.filter(item => item.driverID === driverId));
export const includedDrivers = createSelector(drivers,
  (driverList) => driverList.filter(item => item.isIncluded === true));


export const vehicles = createSelector(leadSelector, (leadState: Lead) => {
  if (leadState.quickQuote && leadState.quickQuote.vehicles) {
    return leadState.quickQuote.vehicles;
  }
});
export const vehicleCount = createSelector(quickQuoteSelector, (quickQuote) => quickQuote.vehicles.length);
export const selectedVehicle = (vehicleId) => createSelector(quickQuoteSelector,
  (quote) => quote.vehicles.filter(item => item.vehicleID === vehicleId));
export const isADPFQuoteSelector = createSelector(quoteSelector, (quote) => quote.isADPFQuote);
export const includedVehicles = createSelector(vehicles,
  (vehicleList) => vehicleList.filter(item => item.isIncluded === true));
export const pniMaritalStatus = createSelector(leadSelector, (leadState: Lead) => leadState.maritalStatusCode);
export const leadID = createSelector(leadSelector, (leadState: Lead) => leadState.leadID);
