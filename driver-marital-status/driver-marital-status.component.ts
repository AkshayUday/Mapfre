import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'verti-driver-marital-status',
  templateUrl: './driver-marital-status.component.html',
  styleUrls: ['./driver-marital-status.component.scss']
})
export class DriverMaritalStatusComponent implements OnInit, AfterViewInit, OnDestroy {
  driverMaritalStatusForm: FormGroup;
  driverMaritalStatusForm$: Subscription;
  imgSource: string;
  title: string;
  driverId: String;
  errorSubscription: Subscription;
  errorOccured: any;
  loaderStopped: boolean;
  leadSub: Subscription;
  loaderSubscription: Subscription;
  count: number;
  constructor(private fb: FormBuilder, private store: Store<any>,
    private router: Router, private activatedRoute: ActivatedRoute, private dialog: MatDialog, private navService: NavigationService) {
    this.imgSource = './assets/img/Icon_MaritalStatus.svg';
    // this.title = `What's <fName>'s marital status?`;
  }

  ngOnInit() {
    this.driverMaritalStatusForm = this.fb.group({
      maritalStatusCode: ['', Validators.compose([
        Validators.required
      ])]
    });

    this.activatedRoute.paramMap.subscribe(params => {
      this.store.select(fromStore.selectedDriver(params.get('id'))).subscribe(drivers => {
        const selectedDriver = drivers[0];
        if (selectedDriver) {
          this.driverId = selectedDriver['driverID'];
          this.title = `What's ${selectedDriver.firstName}'s marital status?`;
          this.driverMaritalStatusForm.patchValue(selectedDriver);
        }
      });
    });
    this.navService.upDateMarketingData();
  }

  ngAfterViewInit() { }

  saveDetails(maritalObj) {
    const driverObj = maritalObj.selected;
    // pniNameObj['isIncluded'] =  true;
    driverObj['driverID'] = this.driverId;
    driverObj.maritalStatusValue = this.getMaritalStatusValue(maritalObj);
    this.store.dispatch(new LeadActions.UpdateDriver(driverObj));
    // this.router.navigate(['drivermajorviolation/' + this.driverId]);
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
  getMaritalStatusValue(data) {
    if (data && data.allOptions) {
      return data.allOptions.filter(item => item.code.trim() === data.selected.maritalStatusCode.trim())[0].name;
    }
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
        this.router.navigate(['drivermajorviolation/' + this.driverId], { queryParamsHandling: 'merge' });

      }
    });
  }
  ngOnDestroy() {
    if (this.driverMaritalStatusForm$) {
      this.driverMaritalStatusForm$.unsubscribe();
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
