import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from '../store/reducers';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FooterDialogModalComponent } from './footer-dialog-modal/footer-dialog-modal.component';
import { SharedModule } from '../shared/shared.module';
import { AppInitService } from './services/app-init.service';
import { EffectsModule } from '@ngrx/effects';
import { RouteEffect } from '../store/effects/route.effects';
import { HttpClientModule } from '@angular/common/http';
import { MinorViolationQuestionsComponent } from '../lead/minor-violation-questions/minor-violation-questions.component';
import { AddressComponent } from '../lead/address/address.component';
import { KoQuestionThreeComponent } from '../lead/ko-question-three/ko-question-three.component';
import { KoQuestionTwoComponent } from '../lead/ko-question-two/ko-question-two.component';
import { KoQuestionOneComponent } from '../lead/ko-question-one/ko-question-one.component';
import { PniInfoComponent } from '../lead/pni-info/pni-info.component';
import { PNINameComponent } from '../lead/pni-name/pni-name.component';
import { PriorAddressComponent } from '../lead/prior-address/prior-address.component';
import { ContactInfoComponent } from '../lead/contact-info/contact-info.component';
import { WalmericDialogModalComponent } from './walmeric-dialog-modal/walmeric-dialog-modal.component';
import { ProductNotFoundComponent } from '../lead/product-not-found/product-not-found.component';
import { VehicleSummaryComponent } from '../lead/vehicle-summary/vehicle-summary.component';
import { DriverSummaryComponent } from '../lead/driver-summary/driver-summary.component';
import { AddDriverComponent } from '../lead/add-driver/add-driver.component';
import { DriverMaritalStatusComponent } from '../lead/driver-marital-status/driver-marital-status.component';
import { DriverMajorViolationsComponent } from '../lead/driver-major-violations/driver-major-violations.component';
import { DriverLicenseStatusComponent } from '../lead/driver-license-status/driver-license-status.component';
import { DriverDrivingHistoryComponent } from '../lead/driver-driving-history/driver-driving-history.component';
import { VehicleComponent } from '../lead/vehicle-add/vehicle.component';
import { ContactpaComponent } from '../lead/contact-pa/contact-pa.component';
import { CalltofinishComponent } from '../lead/calltofinish/calltofinish.component';
import { LeadEffects } from '../store/effects/lead.effects';
import { QuickquoteComponent } from '../lead/quickquote/quickquote.component';
import { KoDeclineComponent } from '../lead/ko-decline/ko-decline.component';
import { SystemFailureComponent } from '../lead/system-failure/system-failure.component';
import { TimeoutModalComponent } from '../shared/timeout-modal/timeout-modal.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([RouteEffect, LeadEffects])
  ],
  exports: [FooterDialogModalComponent, HeaderComponent, FooterComponent],
  declarations: [FooterDialogModalComponent, HeaderComponent,
    FooterComponent, WalmericDialogModalComponent, ProductNotFoundComponent, PniInfoComponent, PNINameComponent, PriorAddressComponent,
    ContactInfoComponent, KoQuestionOneComponent, KoQuestionTwoComponent, KoQuestionThreeComponent, AddDriverComponent,
    AddressComponent, MinorViolationQuestionsComponent, WalmericDialogModalComponent, VehicleSummaryComponent,
    DriverSummaryComponent, DriverMajorViolationsComponent, DriverLicenseStatusComponent,
    DriverMaritalStatusComponent, DriverDrivingHistoryComponent, VehicleComponent,ContactpaComponent,
    QuickquoteComponent, KoDeclineComponent, SystemFailureComponent,
    AddDriverComponent, DriverMaritalStatusComponent,CalltofinishComponent,
    DriverMajorViolationsComponent, DriverLicenseStatusComponent, DriverDrivingHistoryComponent],
  entryComponents: [FooterDialogModalComponent, PniInfoComponent, PNINameComponent, PriorAddressComponent,
    ContactInfoComponent, KoQuestionOneComponent, KoQuestionTwoComponent, KoQuestionThreeComponent,
    AddressComponent, MinorViolationQuestionsComponent, WalmericDialogModalComponent, VehicleSummaryComponent,CalltofinishComponent,
    DriverSummaryComponent, VehicleComponent, QuickquoteComponent, TimeoutModalComponent, AddDriverComponent, DriverMaritalStatusComponent,
    DriverMajorViolationsComponent, DriverLicenseStatusComponent, DriverDrivingHistoryComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (config: AppInitService) => () => config.fetchRoutes(), deps: [AppInitService],
      multi: true
    },
  ]
})
export class CoreModule { }
