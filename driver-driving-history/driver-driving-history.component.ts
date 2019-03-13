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
import { Lead, Driver } from '../../store/models/lead.model';
import { ErrorDialogModalComponent } from '../../shared/error-dialog-modal/error-dialog-modal.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'verti-driver-driving-history',
  templateUrl: './driver-driving-history.component.html',
  styleUrls: ['./driver-driving-history.component.scss']
})
export class DriverDrivingHistoryComponent implements OnInit, OnDestroy {
  driverMinorViolation: FormGroup;
  data;
  allViolationsList;
  koTitle: string;
  koListTitle: string;
  koList: string[];
  driverMinorViolation$: Subscription;
  driverId: String;
  firstName: String = '';
  leadSub: Subscription;
  loaderSubscription: Subscription;
  errorSubscription: Subscription;
  errorOccured: any;
  loaderStopped: any;
  count: number;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<any>, private navService: NavigationService,
    private activatedRoute: ActivatedRoute, private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.driverMinorViolation = this.fb.group({
      noOfMovingViolations: ['none', Validators.required],
      noOfAtFaultAccidents: ['none', Validators.required],
      noOfNotAtFaultAccidents: ['none', Validators.required],
      noOfComprehensiveClaims: ['none', Validators.required]
    });

    this.activatedRoute.paramMap.subscribe(params => {
      this.store.select(fromStore.selectedDriver(params.get('id'))).subscribe(drivers => {
        const selectedDriver = drivers[0];
        if (selectedDriver) {
          this.driverId = selectedDriver['driverID'];
          this.firstName = selectedDriver.firstName;
          this.allViolationsList = [
            {
              formControl: 'noOfMovingViolations',
              subtitle:
                'How many moving violations has ' + this.firstName + ' had?',
              listTitle: 'Common examples are:',
              list: [
                'Speeding',
                'Running a red light/stop sign',
                'Defective vehicle equipment',
                'Improper passing',
                'Failure to yield right of way',
                'Following too close/tailgating',
                'Driving on the wrong side of the road',
                'Careless driving'
              ]
            },
            {
              formControl: 'noOfAtFaultAccidents',
              subtitle: 'How many AT FAULT accidents has ' + this.firstName + ' been involved in?'
            },
            {
              formControl: 'noOfNotAtFaultAccidents',
              subtitle: 'How many NOT AT FAULT accidents has ' + this.firstName + ' been involved in?'
            },
            {
              formControl: 'noOfComprehensiveClaims',
              subtitle: 'How many comprehensive claims has ' + this.firstName + ' made?',
              listTitle: 'Common examples are:',
              list: [
                'Glass repair or replacement',
                'Collision with a bird or animal',
                'Vandalism',
                'Theft',
                'Falling Objects (trees/hail)'
              ]
            }
          ];
          if (selectedDriver.noOfAccidentsAndViolations) {
            this.driverMinorViolation.patchValue(selectedDriver.noOfAccidentsAndViolations);
          }
        }
      });
    });
    this.navService.upDateMarketingData();
  }

  saveQuestion(value) {

  }

  saveDetails() {
    const driverObj = {};
    driverObj['isIncluded'] = true;
    driverObj['isAlreadyIncluded'] = true;
    driverObj['driverID'] = this.driverId;
    driverObj['noOfAccidentsAndViolations'] = this.driverMinorViolation.value;
    this.store.dispatch(new LeadActions.UpdateDriver(driverObj));
    // if (driverObj['isIncluded']) {
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
    // this.errorSubscription = this.store.select(state => state.error).pipe(take(1)).subscribe(error => {
    //   if (!this.errorOccured) {
    //     this.errorOccured = true;
    //     // this.loaderSubscription.unsubscribe();
    //     if (error.code === '') {
    //       // this.router.navigate([nextRouteObj.routeName], { queryParamsHandling: 'merge' });
    //       this.router.navigate(['driversummary'], { queryParamsHandling: 'merge' });

    //     } else {
    //       // this.errorOccured = true;
    //       // alert(error.message);
    //       // this.errorSubscription.unsubscribe();
    //       this.dialog.open(ErrorDialogModalComponent, error);
    //     }
    //   }
    // });
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
        this.router.navigate(['driversummary'], { queryParamsHandling: 'merge' });
      }
    });
  }
  ngOnDestroy() {
    if (this.driverMinorViolation$) {
      this.driverMinorViolation$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }
}
