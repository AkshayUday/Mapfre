import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// import { reportLists } from '../../core/constants';
import * as LeadActions from '../../store/actions/lead.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { distinctUntilChanged, take } from 'rxjs/operators';
import * as fromStore from '../../store/reducers/lead.reducers';
import { NavigationService } from '../../core/services/navigation.service';
import { Lead } from '../../store/models/lead.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'verti-vehicle-summary',
  templateUrl: './vehicle-summary.component.html',
  styleUrls: ['./vehicle-summary.component.scss']
})
export class VehicleSummaryComponent implements OnInit, OnDestroy {

  imgSource: string;
  title: string;
  vehicleData: any;
  numberOfVehicles: number;
  showAtleastMsg: Boolean = false;
  vehicleObservable$: any;
  maxVehicles: boolean;
  maxVehicleLimit: Boolean = false;
  disabledNextBtn: Boolean = false;
  leadSub: Subscription;
  vehiclesList = ['CG', 'CH', 'CP', 'CV', 'HB', 'SV', 'UT', 'PV', 'TU', 'WG', 'SD', 'ST'];
  loaderStopped: boolean;
  loaderSubscription: any;
  leadID: string;
  leadIdSubscription: Subscription;
  vehicleCount$: Subscription;
  includedVehicles$: Subscription;
  constructor(private router: Router, private store: Store<any>, private navService: NavigationService) {
    this.imgSource = './assets/img/Icon_AddVehicle.svg';
    this.title = 'Vehicle Summary';
    this.numberOfVehicles = 0;
    this.store.dispatch(new LeadActions.DeleteIncompleteVehicle());
  }

  ngOnInit() {
    this.vehicleCount$ = this.store.select(fromStore.vehicleCount)
      .pipe(distinctUntilChanged()).subscribe((vehicleCount) => {
        if (vehicleCount) {
          this.numberOfVehicles = vehicleCount;
        }
      });
    this.includedVehicles$ = this.store.select(fromStore.includedVehicles)
      .subscribe((count) => {
        if (count.length < 1) {
          this.disabledNextBtn = true;
        } else {
          this.disabledNextBtn = false;
        }
        if (count.length >= 4) {
          this.maxVehicleLimit = true;
        } else {
          this.maxVehicleLimit = false;
        }
      });

    this.vehicleObservable$ = this.store.select(fromStore.vehicles)
      .pipe(distinctUntilChanged()).subscribe((vehicles) => {
        if (vehicles && vehicles.length) {
          this.vehicleData = vehicles.filter(vehicle => {
            if (vehicle.isADPF === true) {
              if (vehicle['year'] > '1980' && vehicle['model'] && vehicle['make'] && vehicle['vinPrefix']
                && vehicle['vinPrefix'].length === 17) {
                this.showAtleastMsg = true;
                vehicle['iconExisted'] = this.checkBodyStyleCode(vehicle.bodyStyleCode);
                return vehicle;
              }
            } else {
              vehicle['iconExisted'] = this.checkBodyStyleCode(vehicle.bodyStyleCode);
              return vehicle;
            }
          }
          );
        }
      });
    this.leadIdSubscription = this.store.select(fromStore.leadID).pipe(take(1)).subscribe(leadID => this.leadID = leadID);
    this.navService.upDateMarketingData();
  }
  checkBodyStyleCode(bodyStyleCode) {
    if (bodyStyleCode) {
      return this.vehiclesList.includes(bodyStyleCode.trim());
    }
  }

  saveDetails() {
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
        this.navService.navigate();
      }
    });
  }
  addThisVehicle(vehicleID) {
    let vehicle = {};
    vehicle = {
      vehicleID: vehicleID,
      isIncluded: true,
      // isADPF: false,
    };
    this.store.dispatch(new LeadActions.UpdateVehicle(vehicle));
    // this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
    //   this.store.dispatch(new LeadActions.PostLeadAction(leadData));
    // });
  }
  addNewVehicle() {
    const vehicle = {
      vehicleID: this.leadID + '-' + (this.numberOfVehicles + 1).toString(),
      isIncluded: false,
      isADPF: false,
      isAlreadyIncluded: false
    };
    this.store.dispatch(new LeadActions.AddVehicle(vehicle));
    this.navService.navigateToSubRoute(vehicle.vehicleID);
  }
  edit(vehicleID) {
    this.navService.navigateToSubRoute(vehicleID);
  }
  remove(vehicleID) {
    let vehicle = {};
    vehicle = {
      vehicleID: vehicleID,
      isIncluded: false,
      // isADPF: false,
    };
    this.store.dispatch(new LeadActions.UpdateVehicle(vehicle));
    // this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
    //   this.store.dispatch(new LeadActions.PostLeadAction(leadData));
    // });
  }
  splitPublicId(id) {
    id = id.split(':');
    return id[1].trim();
  }

  ngOnDestroy() {
    if (this.vehicleObservable$) {
      this.vehicleObservable$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    if (this.vehicleCount$) {
      this.vehicleCount$.unsubscribe();
    }
    if (this.includedVehicles$) {
      this.includedVehicles$.unsubscribe();
    }
    if (this.leadIdSubscription) {
      this.leadIdSubscription.unsubscribe();
    }
  }

}



