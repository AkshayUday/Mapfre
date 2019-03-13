import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, take, skip } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import * as fromStore from '../../store/reducers/lead.reducers';
import { distinctUntilChanged } from 'rxjs/operators';
import { Lead } from '../../store/models/lead.model';
import * as LeadActions from '../../store/actions/lead.actions';
import { MatDialog } from '@angular/material';
import { ErrorDialogModalComponent } from '../../shared/error-dialog-modal/error-dialog-modal.component';
import { TimeoutModalComponent } from '../../shared/timeout-modal/timeout-modal.component';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  routeStoreSubscription: Subscription;
  visibleRoutes = [];
  routeChangeSubscription: Subscription;
  currentRoute: string;
  lived2months: boolean;
  loaderSubscription: Subscription;
  loaderStopped: boolean;
  errorSubscription: Subscription;
  errorOccured: boolean;
  count: number;
  visibleCurrentSubRoutes = [];
  routeParam: any;
  currentParentRouteIndex: number;
  currentRouteIndex: number;
  isADPFQuote: boolean;
  quoteNumber: string;
  currentRouteObj: any;
  monthlyPremiumPrice: string;
  numOfTimesErrorOccurredOnScreen: number;
  constructor(private store: Store<any>, private router: Router, private dialog: MatDialog) {
    this.currentRoute = '';
    this.lived2months = false;
    this.loaderStopped = false;
    this.isADPFQuote = false;
    this.quoteNumber = '';
    this.monthlyPremiumPrice = '0.00';
    this.numOfTimesErrorOccurredOnScreen = 0;
    // this.routeStoreSubscription = this.store.select(state => state.routes).subscribe(routesState => {
    //   if (routesState && routesState.routes.length) {
    //     this.visibleRoutes = routesState.routes;
    //   }
    // });

    // this.routeChangeSubscription = this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe(event => {
    //   if (event['url']) {
    //     this.currentRoute = event['url'].substr(1);
    //   }
    // });
    // this.currentRoute = this.visibleRoutes[0].routeName;
    this.store.select(fromStore.leadSelector)
      .pipe(distinctUntilChanged()).subscribe(leadData => {
        if (leadData && leadData.primaryAddress) {
          const timeAtCurrentResidence = leadData.primaryAddress.timeAtCurrentResidenceCode === 'lessThan2Months' ? false : true;
          this.lived2months = timeAtCurrentResidence;
        }
        if (leadData && leadData.quickQuote.monthlyPremiumPrice) {
          this.monthlyPremiumPrice = leadData.quickQuote.monthlyPremiumPrice;
        }
      });
  }
  // navigate() {
  //   const nextRouteObj = this.getNextRoute();
  //   this.errorOccured = false;
  //   if (nextRouteObj && nextRouteObj.routeName) {
  //     this.loaderSubscription = this.store.select(state => state.loader.isLoading).pipe(take(1)).subscribe(loading => {
  //       // if (!loading) {
  //       //   this.router.navigate([nextRouteObj.routeName], { queryParamsHandling: 'merge' });
  //       // }
  //       if (!loading) {
  //         this.loaderStopped = true;
  //         this.errorSubscription = this.store.select(state => state.error).pipe(take(1)).subscribe(error => {
  //           if (!loading && !this.errorOccured) {
  //             this.errorOccured = true;
  //             // this.loaderSubscription.unsubscribe();
  //             if (error.code === '') {
  //               this.router.navigate([nextRouteObj.routeName], { queryParamsHandling: 'merge' });
  //             } else {
  //               // this.errorOccured = true;
  //               alert(error.message);
  //               // this.errorSubscription.unsubscribe();
  //             }
  //           }
  //         });
  //       }
  //     });
  //     if (this.loaderStopped) {
  //       this.loaderSubscription.unsubscribe();
  //       if (this.errorOccured) {
  //         this.errorSubscription.unsubscribe();
  //       }
  //     }
  //     setTimeout(() => {
  //       this.loaderSubscription.unsubscribe();
  //       this.errorSubscription.unsubscribe();
  //     });
  //   }
  // }
  navigate() {
    const nextRouteObj = this.getNextRoute();
    this.processNavigation(nextRouteObj);
  }
  navigateToSubRoute(routeParam) {
    this.currentParentRouteIndex = this.getCurrentRouteIndex();
    this.visibleCurrentSubRoutes = this.getVisibleSubRoutesByRoute();
    this.routeParam = routeParam;
    const nextRouteObj = this.visibleCurrentSubRoutes[0];
    // const temp = {...nextRouteObj, }
    const updatedRouteName = nextRouteObj.routeName.replace(/:id/gi, routeParam);
    const routeObj = { ...nextRouteObj, ...{ routeName: updatedRouteName } };
    this.processNavigation(routeObj);
  }
  navigateSubRouteToSubRoute() {
    const nextRouteObj = this.getNextSubRoute();
    // nextRouteObj.routeName = nextRouteObj.routeName.replace(/:id/gi, this.routeParam);
    if (nextRouteObj) {
      const updatedRouteName = nextRouteObj.routeName.replace(/:id/gi, this.routeParam);
      const routeObj = { ...nextRouteObj, ...{ routeName: updatedRouteName } };
      this.processNavigation(routeObj);
    } else {
      const routeObj = this.getRouteByIndex(this.currentParentRouteIndex);
      this.processNavigation(routeObj);
    }
  }
  getNextSubRoute() {
    const currentSubRouteIndex = this.getCurrentSubRouteIndex();
    if (currentSubRouteIndex !== -1 && currentSubRouteIndex !== undefined && currentSubRouteIndex !== null) {
      if (currentSubRouteIndex < this.visibleCurrentSubRoutes.length - 1) {
        return this.visibleCurrentSubRoutes[currentSubRouteIndex + 1];
      } // else {
      //   const routeObj = this.getRouteByIndex(this.currentParentRouteIndex);
      //   this.processNavigation(routeObj);
      // }
    }
  }
  getCurrentSubRouteIndex() {
    return this.visibleCurrentSubRoutes.findIndex(subRoute => subRoute.routeName.split('/:id')[0] === this.currentRoute.split('/')[0]);
  }
  getVisibleSubRoutesByRoute() {
    const currentRouteArrObj = this.visibleRoutes.filter(route => route.routeName === this.currentRoute);
    if (currentRouteArrObj.length) {
      if (currentRouteArrObj[0].childRoutes && currentRouteArrObj[0].childRoutes.length) {
        return currentRouteArrObj[0].childRoutes.filter(item => item.visible === true);
      }
    }
    return [];
  }
  processNavigation(nextRouteObj) {
    this.errorOccured = false;
    this.count = 0;
    this.store.select(fromStore.quoteSelector).subscribe(quote => {
      this.isADPFQuote = quote.isADPFQuote;
      this.quoteNumber = quote.quoteNumber;
    });
    if (nextRouteObj && nextRouteObj.routeName) {
      this.errorSubscription = this.store.select(state => state.error).pipe(skip(1)).subscribe(error => {
        if (!this.errorOccured) {
          this.count++;
          this.errorOccured = true;
          const errorCode = +error.code;
          // if (errorCode) {
          //   if (errorCode === 602 || errorCode === 603) {
          //     this.gotoRouteByName('kodecline');
          //   } else if (errorCode === 500) {
          //     this.dialog.open(TimeoutModalComponent, {
          //       height: '510px',
          //       data: error,
          //       panelClass: 'custom-timeout-modal'
          //     });
          //   } else {
          //     this.gotoRouteByName('systemfailure');
          //   }
          // }
          if (errorCode) {
            this.numOfTimesErrorOccurredOnScreen++;
            if (errorCode === 602 || errorCode === 603) {
              this.gotoRouteByName('kodecline');
            } else if (this.numOfTimesErrorOccurredOnScreen < 4) {
              this.dialog.open(TimeoutModalComponent, {
                height: '510px',
                data: error,
                panelClass: 'custom-timeout-modal'
              });
            } else {
              this.gotoRouteByName('systemfailure');
            }
          }
        }
      });
      setTimeout(() => {
        if (this.count === 0) {
          if (this.quoteNumber && !this.isADPFQuote) {
            this.gotoRouteByName('systemfailure');
          } else if (nextRouteObj.routeName === 'quickquote' && (!this.monthlyPremiumPrice || this.monthlyPremiumPrice === '0'
            || this.monthlyPremiumPrice === '0.00')) {
            this.gotoRouteByName('systemfailure');
          } else {
            this.router.navigate([nextRouteObj.routeName], { queryParamsHandling: 'merge' });
          }
        }
      });
    }
    // if (this.loaderStopped) {
    // this.loaderSubscription.unsubscribe();
    if (this.errorOccured) {
      this.errorSubscription.unsubscribe();
    }
    // }
    setTimeout(() => {
      // this.loaderSubscription.unsubscribe();
      this.errorSubscription.unsubscribe();
    });
  }
  getNextRoute() {
    const currentRouteIndex = this.getCurrentRouteIndex();
    // this.currentParentRouteIndex = currentRouteIndex;
    const previousAddressIndex = this.getRouteIndexByName('previousaddress');
    if (currentRouteIndex !== undefined && currentRouteIndex !== null && currentRouteIndex !== -1) {
      // return this.visibleRoutes[currentRouteIndex + 1];
      if (previousAddressIndex !== -1) {
        if (this.lived2months) {
          if (currentRouteIndex === previousAddressIndex - 1) {
            return this.visibleRoutes[currentRouteIndex + 2];
          }
        }
      }
      // if in last dynamic route
      // if (currentRouteIndex === this.visibleRoutes.length - 1) {
      //   this.gotoRouteByName('driversummary');
      // }
      return this.visibleRoutes[currentRouteIndex + 1];
    }
  }
  getCurrentRouteIndex() {
    return this.visibleRoutes.findIndex(routeObj => routeObj.routeName === this.currentRoute);
  }
  getPrevoiusRoute() {
    const currentRouteIndex = this.getCurrentRouteIndex();
    if (currentRouteIndex !== undefined && currentRouteIndex !== null && currentRouteIndex !== -1) {
      return this.visibleRoutes[currentRouteIndex - 1];
    }
  }
  navigateBack() {
    const previousRouteObj = this.getPrevoiusRoute();
    this.router.navigate([previousRouteObj.routeName]);
  }
  getRouteIndexByName(routeName: string) {
    return this.visibleRoutes.findIndex(routeObj => routeObj.routeName === routeName);
  }
  gotoRouteByIndex(routeIndex) {
    const routeObj = this.visibleRoutes[routeIndex];
    this.router.navigate([routeObj.routeName]);
  }
  getRouteByIndex(routeIndex) {
    return this.visibleRoutes[routeIndex];
  }
  gotoRouteByName(routeName) {
    this.router.navigate([routeName]);
  }
  makeChangesOnRouteNav() {
    const routeArr = this.currentRoute.split('/');
    let childFound = false;
    if (routeArr[1]) {
      // return this.visibleRoutes.findIndex(route => route.name === this.currentRoute.split('/')[0]);
      this.visibleRoutes.forEach((route, index) => {
        if (!childFound) {
          if (route['childRoutes']) {
            const childIndex = route['childRoutes'].findIndex(childRoute =>
              childRoute.routeName.split('/:id')[0] === this.currentRoute.split('/')[0]);
            if (childIndex > -1) {
              this.currentParentRouteIndex = index;
              this.currentRouteObj = route['childRoutes'][childIndex];
              childFound = true;
            }
          }
        }
      });
      // this.visibleRoutes.filter(route => route['childRoutes'] && route['childRoutes'].length > 0).forEach((route, index) => {
      //   const childIndex = route.childRoutes.findIndex(childRoute =>
      //     childRoute.routeName.split('/:id')[0] === this.currentRoute.split('/')[0]);
      //   if (childIndex > -1) {
      //     this.currentParentRouteIndex = index;
      //   }
      // });
    } else {
      this.currentParentRouteIndex = 0;
      this.currentRouteObj = this.visibleRoutes.filter(routeObj => routeObj.routeName === this.currentRoute)[0];
      this.visibleCurrentSubRoutes = this.getVisibleSubRoutesByRoute();
    }
  }
  upDateMarketingData() {
    const marketingData = {
      currentURL: window.location.href
    };
    this.store.dispatch(new LeadActions.SaveMarketingData(marketingData));
  }
  updateGenerateQuickQuotePriceFlag() {

  }
}
