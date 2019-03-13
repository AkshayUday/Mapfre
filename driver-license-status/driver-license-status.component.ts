import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as LeadActions from '../../store/actions/lead.actions';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../core/services/navigation.service';
import * as fromStore from '../../store/reducers/lead.reducers';
import { distinctUntilChanged, take, skip } from 'rxjs/operators';
import { Lead } from '../../store/models/lead.model';
import { ErrorDialogModalComponent } from '../../shared/error-dialog-modal/error-dialog-modal.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'verti-driver-license-status',
  templateUrl: './driver-license-status.component.html',
  styleUrls: ['./driver-license-status.component.scss']
})
export class DriverLicenseStatusComponent implements OnInit, OnDestroy {

  licenseStatusForm: FormGroup;
  title: string;
  licenseStatusForm$: Subscription;
  imgSource: string;
  eligibilityAnswers: any;
  driverId: String;
  errorSubscription: Subscription;
  errorOccured: any;
  loaderStopped: boolean;
  loaderSubscription: Subscription;
  leadSub: Subscription;
  count: number;
  constructor(private fb: FormBuilder, private router: Router, private store: Store<any>,
    private navService: NavigationService, private activatedRoute: ActivatedRoute, private dialog: MatDialog) {
    this.imgSource = './assets/img/Icon_driverlicense.svg';
  }

  ngOnInit() {
    this.licenseStatusForm = this.fb.group({
      licenseRevoked: ['', Validators.required],
    });


    this.activatedRoute.paramMap.subscribe(params => {
      this.store.select(fromStore.selectedDriver(params.get('id'))).subscribe(drivers => {
        const selectedDriver = drivers[0];
        if (selectedDriver) {
          this.driverId = selectedDriver['driverID'];
          this.title = `Is ${selectedDriver.firstName}'s driver’s license suspended/revoked currently or
          has it been in the last 5 years?`;
          this.licenseStatusForm.patchValue(selectedDriver);
        }
      });
    });
    this.navService.upDateMarketingData();
  }
  navigateToNextPage() {
    this.count = 0;
    this.errorSubscription = this.store.select(state => state.error).pipe(skip(1)).subscribe(error => {
      if (!this.errorOccured) {
        this.count++;
        this.errorOccured = true;
        // this.loaderSubscription.unsubscribe();
        if (error.code === '') {
          // this.router.navigate([nextRouteObj.routeName], { queryParamsHandling: 'merge' });
        } else {
          // this.errorOccured = true;
          // alert(error.message);
          // this.errorSubscription.unsubscribe();
          this.dialog.open(ErrorDialogModalComponent, { data: error });
        }
      }
    });
    setTimeout(() => {
      if (this.count === 0) {
        this.router.navigate(['driverdrivinghistory/' + this.driverId], { queryParamsHandling: 'merge' });
      }
    });
  }
  saveDetails() {
    const driverObj = this.licenseStatusForm.value;
    driverObj['driverID'] = this.driverId;
    this.store.dispatch(new LeadActions.UpdateDriver(driverObj));
    // this.router.navigate(['driverdrivinghistory/' + this.driverId]);
    // if (driverObj.isIncluded) {
    //   this.loaderStopped = false;
    //   this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
    //     this.store.dispatch(new LeadActions.PostLeadAction(leadData));
    //   });
    //   this.loaderSubscription = this.store.select(state => state.loader.isLoading).subscribe(loading => {
    //     if (!loading && !this.loaderStopped) {
    //       if (this.leadSub) {
    //         this.leadSub.unsubscribe();
    //       }
    //       this.loaderStopped = true;
    //       // this.navigateToNextPage();
    //       this.navService.navigateSubRouteToSubRoute();
    //     }
    //   });
    // } else {
    //   // this.navigateToNextPage();
    //   this.navService.navigateSubRouteToSubRoute();
    // }
    this.navService.navigateSubRouteToSubRoute();
  }

  ngOnDestroy() {
    if (this.licenseStatusForm$) {
      this.licenseStatusForm$.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }

}
