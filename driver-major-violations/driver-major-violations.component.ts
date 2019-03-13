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
  selector: 'verti-driver-major-violations',
  templateUrl: './driver-major-violations.component.html',
  styleUrls: ['./driver-major-violations.component.scss']
})
export class DriverMajorViolationsComponent implements OnInit, OnDestroy {

  majorViolationsForm: FormGroup;
  title: string;
  violationsList: string[];
  majorViolationsForm$: Subscription;
  imgSource: string;
  eligibilityAnswers: any;
  driverId: String;
  errorSubscription: any;
  leadSub: any;
  loaderSubscription: any;
  loaderStopped: boolean;
  errorOccured: any;
  count: number;
  constructor(private fb: FormBuilder, private router: Router, private store: Store<any>,
    private navService: NavigationService, private activatedRoute: ActivatedRoute, private dialog: MatDialog) {
    // this.koTitle = 'In the last 5 years has your driver\'s license been suspended or revoked?';
    this.imgSource = './assets/img/Icon_Cop.svg';
    this.violationsList = [
      'Driving under the influence of alcohol',
      'Drag racing',
      'Fleeing or eluding police',
      'Passing stopped school bus',
      'Reckless driving',
      'Vehicle assault/felony/homicide',
    ];
  }

  ngOnInit() {
    this.majorViolationsForm = this.fb.group({
      majorViolations: ['', Validators.required],
    });


    this.activatedRoute.paramMap.subscribe(params => {
      this.store.select(fromStore.selectedDriver(params.get('id'))).subscribe(drivers => {
        const selectedDriver = drivers[0];
        if (selectedDriver) {
          this.driverId = selectedDriver['driverID'];
          this.title = `In the last 5 years, has ${selectedDriver.firstName} been convicted of any major violations like:`;
          this.majorViolationsForm.patchValue(selectedDriver);
        }
      });
    });
    this.navService.upDateMarketingData();
  }


  saveDetails() {
    const driverObj = this.majorViolationsForm.value;
    // pniNameObj['isIncluded'] =  true;
    driverObj['driverID'] = this.driverId;
    this.store.dispatch(new LeadActions.UpdateDriver(driverObj));
    // this.router.navigate(['licensesuspended/' + this.driverId]);
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
    //       // this.router.navigate(['driversummary']);
    //       // this.navService.navigate();
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
        // this.router.navigate([nextRouteObj.routeName], { queryParamsHandling: 'merge' });
        // this.router.navigate(['drivermajorviolation/' + this.driverId], { queryParamsHandling: 'merge' });
        this.router.navigate(['licensesuspended/' + this.driverId], { queryParamsHandling: 'merge' });

      }
    });
  }
  ngOnDestroy() {
    if (this.majorViolationsForm$) {
      this.majorViolationsForm$.unsubscribe();
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
