import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Driver, Lead } from '../../store/models/lead.model';
import * as LeadActions from '../../store/actions/lead.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { distinctUntilChanged, take } from 'rxjs/operators';
import * as fromStore from '../../store/reducers/lead.reducers';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'verti-driver-summary',
  templateUrl: './driver-summary.component.html',
  styleUrls: ['./driver-summary.component.scss']
})
export class DriverSummaryComponent implements OnInit, OnDestroy {

  imgSource: string;
  title: string;
  driverData: any;
  numberOfDrivers: number;
  maxDriverLimit: Boolean = false;
  driverObservable$: any;
  driverCount$: any;
  includedDrivers$: any;
  leadSub: any;
  loaderSubscription: any;
  loaderStopped: any;
  leadID: string;
  leadIdSubscription: Subscription;
  constructor(private router: Router, private http: HttpClient, private store: Store<any>, private navService: NavigationService) {
    this.imgSource = './assets/img/Icon_Driver.svg';
    this.title = 'Driver Summary';
    this.numberOfDrivers = 0;
    this.store.dispatch(new LeadActions.DeleteIncompleteDriver());

  }

  ngOnInit() {
    this.driverCount$ = this.store.select(fromStore.driverCount)
      .subscribe((driverCount) => {
        if (driverCount) {
          this.numberOfDrivers = driverCount;
        }
      });
    this.includedDrivers$ = this.store.select(fromStore.includedDrivers)
      .subscribe((driverCount) => {
        if (driverCount.length >= 5) {
          this.maxDriverLimit = true;
        } else {
          this.maxDriverLimit = false;
        }
      });
    this.driverObservable$ = this.store.select(fromStore.drivers)
      .pipe(distinctUntilChanged())
      .subscribe((drivers) => {
        if (drivers) {
          this.driverData = drivers;
          this.driverData = this.driverData.map(driver => {
            const temp = {
              ...driver,
              // age: this.calcAge(driver),
              genderImg: this.checkGender(driver.genderCode),
              genderCode: (driver.genderCode === 'M') ? 'male' : 'female'
            };
            return temp;
          });
        }
      });
    this.leadIdSubscription = this.store.select(fromStore.leadID).pipe(take(1)).subscribe(leadID => this.leadID = leadID);
    this.navService.upDateMarketingData();
  }


  calcAge(obj) {
    if (obj.age) {
      return obj.age;
    } else if (obj.dateOfBirth) {
      const dateOfBirth: any = obj.dateOfBirth.year + '-' + obj.dateOfBirth.month + '-' + obj.dateOfBirth.day;
      const dob: any = new Date(dateOfBirth);
      const ageDiff = Math.abs(Date.now() - dob);
      return Math.floor((ageDiff / (1000 * 3600 * 24)) / 365);
    }
  }

  checkGender(gender) {
    // return (gender === 'M') ? './assets/img/male-2.svg' : './assets/img/female-1.svg';
    return (gender === 'M') ? './assets/img/undefined-1.svg' : './assets/img/undefined-1.svg';
  }
  trackByFn(index: number, element: any) {
    return element ? element.driverID : null;
  }

  saveDetails() {
    // this.navService.navigate();
    this.loaderStopped = false;
    this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
      this.store.dispatch(new LeadActions.PostLeadAction(leadData));
    });
    this.loaderSubscription = this.store.select(state => state.loader.isLoading).subscribe(loading => {
      if (!loading && !this.loaderStopped) {
        if (this.leadSub) {
          this.leadSub.unsubscribe();
        }
        this.loaderStopped = true;
        // this.router.navigate(['driversummary']);
        this.navService.navigate();
      }
    });
    // this.navService.navigate();
    // setTimeout(() => {
    //   // if (this.leadSub) {
    //   //   this.leadSub.unsubscribe();
    //   // }
    //   this.navService.upDateMarketingData();
    // });
  }
  addDriver() {
    const driver = {
      driverID: this.leadID + '-' + (this.numberOfDrivers + 1).toString(),
      isIncluded: false,
      isADPF: false,
      isAlreadyIncluded: false
    };
    this.store.dispatch(new LeadActions.AddDriver(driver));
    this.navService.navigateToSubRoute(driver.driverID);
    // this.router.navigate(['driverbasicinfo/' + driver.driverID], { queryParamsHandling: 'merge' });

  }
  editDriver(driver) {
    const driverID = driver.driverID;
    // this.router.navigate(['driverbasicinfo/' + driverID], { queryParamsHandling: 'merge' });
    this.navService.navigateToSubRoute(driverID);
  }
  addDriverBack(driver) {
    if (!driver.isAlreadyIncluded) {
      const driverID = driver.driverID;
      // this.router.navigate(['driverbasicinfo/' + driverID], { queryParamsHandling: 'merge' });
      this.navService.navigateToSubRoute(driverID);
    } else {
      const pniNameObj = {
        driverID: driver.driverID,
        isIncluded: true
      };
      this.store.dispatch(new LeadActions.UpdateDriver(pniNameObj));
      // this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
      //   this.store.dispatch(new LeadActions.PostLeadAction(leadData));
      // });
    }
  }
  removeDriver(driverID) {
    // const pId = this.splitPublicId(driverID);
    const pniNameObj = {
      driverID: driverID,
      isIncluded: false
    };
    this.store.dispatch(new LeadActions.UpdateDriver(pniNameObj));
    // this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
    //   this.store.dispatch(new LeadActions.PostLeadAction(leadData));
    // });
  }
  splitPublicId(id) {
    id = id.split(':');
    return id[1].trim();
  }

  ngOnDestroy() {
    if (this.driverObservable$) {
      this.driverObservable$.unsubscribe();
    }
    if (this.driverCount$) {
      this.driverCount$.unsubscribe();
    }
    if (this.includedDrivers$) {
      this.includedDrivers$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    if (this.leadIdSubscription) {
      this.leadIdSubscription.unsubscribe();
    }
  }
}



