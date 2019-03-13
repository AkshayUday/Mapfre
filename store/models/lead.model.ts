// export interface Lead {
//   leadId: string;
//   sessionUUID: string;
//   firstName: string;
//   lastName: string;
//   dateOfBirth: DateOfBirth;
//   genderCode: string;
//   genderValue: string;
//   maritalStatusCode: string;
//   maritalStatusValue: string;
//   primaryAddress: PrimaryAddress;
//   additionalAddress: AdditionalAddress;
//   emailAddress: string;
//   phoneNumber: string;
//   quickQuote: QuickQuote;
//   quote: Quote;
//   marketingData: MarketingData;
//   relationshipCode: string;
//   relationshipValue: string;
// }
// export interface DateOfBirth {
//   year: number;
//   month: number;
//   day: number;
// }
// export interface PrimaryAddress {
//   addressLine1: string;
//   addressLine2: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   county: string;
//   country: string;
//   timeAtCurrentResidenceCode: string;
//   timeAtCurrentResidenceValue: string;
//   cantFindAddress: boolean;
//   isAddressVerified: boolean;
// }
// export interface AdditionalAddress {
//   addressLine1: string;
//   addressLine2: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   county: string;
//   country: string;
//   isAddressVerified: boolean;
//   cantFindAddress: boolean;
//   timeAtCurrentResidenceCode: string;
//   timeAtCurrentResidenceValue: string;
// }
// export interface Quote {
//   quoteNumber: string;
//   eligibilityAnswers: EligibilityAnswers;
// }
// export interface QuickQuote {
//   quickQuoteNumber: string;
//   drivers: Driver[];
//   vehicles: Vehicle[];
//   monthlyPremiumPrice: string;
//   fullTermPremiumPrice: string;
//   periodStartDate: PeriodStartDate;
//   perioEndDate: PeriodEndDate;
//   quickQuoteCreationDate: QuickQuoteCreationDate;
//   policyTerm: string;
// }
// export interface QuickQuoteCreationDate {
//   year: number;
//   month: number;
//   day: number;
// }
// export interface EligibilityAnswers {
//   ineligibleVehicle: string;
//   majorViolations: string;
//   licenseRevoked: string;
// }
// export interface Driver {
//   // driverId = leadId-1
//   driverID: string;
//   // enterprisePartyId: string;
//   firstName: string;
//   lastName: string;
//   dateOfBirth: DateOfBirth;
//   maritalStatusCode: string;
//   maritalStatusValue: string;
//   genderCode: string;
//   genderValue: string;
//   age: string;
//   isIncluded: boolean;
//   isPNI: boolean;
//   isADPF: boolean;
//   accidentsAndViolations: AccidentsAndViolations;
//   noOfAccidentsAndViolations: NoOfAccidentsAndViolations;
//   relationshipCode: string;
//   relationshipValue: string;

// }
// export interface NoOfAccidentsAndViolations {
//   noOfMovingViolations: string;
//   noOfAtFaultAccidents: string;
//   noOfNotAtFaultAccidents: string;
//   noOfComprehensiveClaims: string;
// }
// export interface Vehicle {
//   // vehicleId = leadId-1
//   vehicleId: string;
//   year: string;
//   make: string;
//   model: string;
//   trim: string;
//   vinPrefix: string;
//   bodyStyleDesc: string;
//   trimDesc: string;
//   bodyStyleCode: string;
//   stubbedVIN: String;
//   isIncluded: boolean;
//   isADPF: boolean;
//   status: Status;
//   error: Error;
// }
// export interface AccidentsAndViolations {
//   // accidentsAndViolationsId = leadId-1-1
//   accidentsAndViolationsId: string;
//   violationCode: string;
//   incidentType: string;
//   incidentDate: IncidentDate;
//   status: Status;
//   error: Error;
// }
// export interface IncidentDate {
//   year: number;
//   month: number;
//   day: number;
// }
// export interface MarketingData {
//   campaignId: string;
//   leadSource: string;
//   currentURL: string;
//   referringURL: string;
// }
// export interface PeriodStartDate {
//   year: number;
//   month: number;
//   day: number;
// }
// export interface PeriodEndDate {
//   year: number;
//   month: number;
//   day: number;
// }
// export interface QuoteEligiblity {
//   referToPA: boolean;
// }
// export interface Status {
//   statusCode: number;
//   statusDescrition: string;
// }
// export interface Error {
//   errorCode: string;
//   errorDescription: string;
// }

export interface Lead {
  leadID: string;
  publicId: string;
  sessionUUID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: DateOfBirth;
  genderCode: string;
  genderValue: string;
  maritalStatusCode: string;
  maritalStatusValue: string;
  primaryAddress: PrimaryAddress;
  priorAddress: PriorAddress;
  emailAddress: string;
  phoneNumber: string;
  quickQuote: QuickQuote;
  quote: Quote;
  marketingData: MarketingData;
  relationshipCode: string;
  relationshipValue: string;
  recordStatus: RecordStatus;
  error: Error;
  generateQuickQuotePrice: false;
}
export interface DateOfBirth {
  year: number;
  month: number;
  day: number;
}
export interface PrimaryAddress {
  publicId: string;
  displayName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  country: string;
  timeAtCurrentResidenceCode: string;
  timeAtCurrentResidenceValue: string;
  isAddressVerified: boolean;
  cantFindAddress: boolean;
}
export interface PriorAddress {
  publicId: string;
  displayName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  county: string;
  country: string;
  timeAtCurrentResidenceCode: string;
  timeAtCurrentResidenceValue: string;
  isAddressVerified: boolean;
  cantFindAddress: boolean;
}
export interface EligibilityAnswers {
  ineligibleVehicle: string;
  majorViolations: string;
  licenseRevoked: string;
}
export interface Quote {
  quoteNumber: string;
  eligibilityAnswers: EligibilityAnswers;
  quoteStatus: string;
  recordStatus: RecordStatus;
  error: Error;
  isADPFQuote: boolean;
}
export interface QuickQuote {
  quickQuoteNumber: string;
  drivers: Driver[];
  vehicles: Vehicle[];
  monthlyPremiumPrice: string;
  fullTermPremiumPrice: string;
  periodStartDate: PeriodStartDate;
  periodEndDate: PeriodEndDate;
  quickQuoteCreationDate: QuickQuoteCreationDate;
  policyTerm: string;
  quickQuoteStatus: string;
  quoteEligiblity: QuoteEligiblity;
  recordStatus: RecordStatus;
  error: Error;
}
export interface QuickQuoteCreationDate {
  year: number;
  month: number;
  day: number;
}
export interface QligibilityAnswers {
  ineligibleVehicle: string;
  majorViolations: string;
  licenseRevoked: string;
}
export interface Driver {
  // driverId = leadId-1
  driverID: string;
  // enterprisePartyId: string;
  publicId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: DateOfBirth;
  maritalStatusCode: string;
  maritalStatusValue: string;
  genderCode: string;
  genderValue: string;
  age: string;
  isIncluded: boolean;
  isPNI: boolean;
  isADPF: boolean;
  accidentsAndViolations: AccidentsAndViolations;
  noOfAccidentsAndViolations: NoOfAccidentsAndViolations;
  relationshipCode: string;
  relationshipValue: string;
  licenseNumber: string;
  licenseState: string;
  yearsLicensed: string;
  recordStatus: RecordStatus;
  error: Error;
}
export interface NoOfAccidentsAndViolations {
  noOfMovingViolations: string;
  noOfAtFaultAccidents: string;
  noOfNotAtFaultAccidents: string;
  noOfComprehensiveClaims: string;
}

export interface Vehicle {
  // vehicleId = leadId-1
  vehicleID: string;
  publicId: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  vin: string;
  bodyStyle: string;
  vinPrefix: string;
  bodyStyleDesc: string;
  trimDesc: string;
  bodyStyleCode: string;
  stubbedVIN: String;
  isIncluded: boolean;
  isADPF: boolean;
  recordStatus: RecordStatus;
  error: Error;
}
export interface AccidentsAndViolations {
  // accidentsAndViolationsId = leadId-1-1
  accidentsAndViolationsId: string;
  violationCode: string;
  incidentType: string;
  incidentDate: IncidentDate;
  recordStatus: RecordStatus;
  error: Error;
}
export interface IncidentDate {
  year: number;
  month: number;
  day: number;
}
export interface MarketingData {
  campaignId: string;
  leadSource: string;
  currentURL: string;
  referringURL: string;
}
export interface PeriodStartDate {
  year: number;
  month: number;
  day: number;
}
export interface PeriodEndDate {
  year: number;
  month: number;
  day: number;
}
export interface QuoteEligiblity {
  isEligible: boolean;
  isKnockout: boolean;
  isReferToPA: boolean;
}
export interface RecordStatus {
  statusCode: number;
  statusDescrition: string;
}
export interface Error {
  errorCode: string;
  errorDescription: string;
}
