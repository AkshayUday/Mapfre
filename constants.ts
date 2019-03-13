import { PniInfoComponent } from '../lead/pni-info/pni-info.component';
import { PNINameComponent } from '../lead/pni-name/pni-name.component';
import { AddressComponent } from '../lead/address/address.component';
import { PriorAddressComponent } from '../lead/prior-address/prior-address.component';
import { ContactInfoComponent } from '../lead/contact-info/contact-info.component';
import { KoQuestionOneComponent } from '../lead/ko-question-one/ko-question-one.component';
import { KoQuestionTwoComponent } from '../lead/ko-question-two/ko-question-two.component';
import { KoQuestionThreeComponent } from '../lead/ko-question-three/ko-question-three.component';
import { MinorViolationQuestionsComponent } from '../lead/minor-violation-questions/minor-violation-questions.component';
import { VehicleSummaryComponent } from '../lead/vehicle-summary/vehicle-summary.component';
import { DriverSummaryComponent } from '../lead/driver-summary/driver-summary.component';
import { QuickquoteComponent } from '../lead/quickquote/quickquote.component';
import { AddDriverComponent } from '../lead/add-driver/add-driver.component';
import { DriverMaritalStatusComponent } from '../lead/driver-marital-status/driver-marital-status.component';
import { DriverMajorViolationsComponent } from '../lead/driver-major-violations/driver-major-violations.component';
import { DriverLicenseStatusComponent } from '../lead/driver-license-status/driver-license-status.component';
import { DriverDrivingHistoryComponent } from '../lead/driver-driving-history/driver-driving-history.component';
import { VehicleComponent } from '../lead/vehicle-add/vehicle.component';
export const RouteMap = {
    // basicinfo: { path: 'basicinfo', component: PNINameComponent },
    // maritalstatus: { path: 'maritalstatus', component: PniInfoComponent },
    // homeaddress: { path: 'homeaddress', component: AddressComponent },
    // previousaddress: { path: 'previousaddress', component: PriorAddressComponent },
    // contactinfo: { path: 'contactinfo', component: ContactInfoComponent },
    // koqone: { path: 'koqone', component: KoQuestionOneComponent },
    // koqtwo: { path: 'koqtwo', component: KoQuestionTwoComponent },
    // koqthree: { path: 'koqthree', component: KoQuestionThreeComponent }

    basicinfo: { path: 'basicinfo', component: PNINameComponent },
    maritalstatus: { path: 'maritalstatus', component: PniInfoComponent },
    homeaddress: { path: 'homeaddress', component: AddressComponent },
    previousaddress: { path: 'previousaddress', component: PriorAddressComponent },
    contactinfo: { path: 'contactinfo', component: ContactInfoComponent },
    eligibilityquestionone: { path: 'eligibilityquestionone', component: KoQuestionOneComponent },
    eligibilityquestiontwo: { path: 'eligibilityquestiontwo', component: KoQuestionTwoComponent },
    eligibilityquestionthree: { path: 'eligibilityquestionthree', component: KoQuestionThreeComponent },
    drivinghistory: { path: 'drivinghistory', component: MinorViolationQuestionsComponent },
    driversummary: { path: 'driversummary', component: DriverSummaryComponent },
    vehiclesummary: { path: 'vehiclesummary', component: VehicleSummaryComponent },
    'driverbasicinfo/:id': { path: 'driverbasicinfo/:id', component: AddDriverComponent },
    'drivermaritalstatus/:id': { path: 'drivermaritalstatus/:id', component: DriverMaritalStatusComponent },
    'drivermajorviolation/:id': { path: 'drivermajorviolation/:id', component: DriverMajorViolationsComponent },
    'licensesuspended/:id': { path: 'licensesuspended/:id', component: DriverLicenseStatusComponent },
    'driverdrivinghistory/:id': { path: 'driverdrivinghistory/:id', component: DriverDrivingHistoryComponent },
    'vehicleadd/:id': { path: 'vehicleadd/:id', component: VehicleComponent },
    quickquote: { path: 'quickquote', component: QuickquoteComponent }
    // qqlanding -
    // adddriver -
    // editdriver -
    // addvehicle -
    // editvehicle

};
