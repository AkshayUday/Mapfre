import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import * as RouteActions from '../../store/actions/route.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { RouteMap } from '../constants';
import { Subscription } from 'rxjs';
import * as LeadActions from '../../store/actions/lead.actions';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  routeStoreSubscription: Subscription;
  constructor(private injector: Injector, private store: Store<any>) { }
  fetchRoutes() {
    return new Promise((resolve, reject) => {
      this.store.dispatch(new RouteActions.GetRouteAction());
      this.routeStoreSubscription = this.store.select(state => state.routes).subscribe(routesState => {
        // console.log(routes);
        if (routesState && routesState.routes.length) {
          const visibleRouteList = routesState.routes.filter(item => item.visible === true);
          // const visibleRouteList = routesState.routes;
          const router = this.injector.get(Router);
          visibleRouteList.forEach((route, index) => {
            // push all the visible routes to route configuration
            let visibleChildRouteList = [];
            const childRoutes = route['childRoutes'];
            if (childRoutes && childRoutes.length) {
              visibleChildRouteList = childRoutes.filter(item => item.visible === true);
            }
            router.config.unshift(RouteMap[route.routeName]);
            if (visibleChildRouteList && visibleChildRouteList.length) {
              visibleChildRouteList.forEach(childRoute => {
                router.config.unshift(RouteMap[childRoute.routeName]);
              });
            }
          });
          const currentUrl = window.location.href;
          let campaignID = this.getParameterByName('campaignID');
          if (!campaignID) {
            campaignID = window['dataLayer']['campaignID'];
          }
          const referringURL = this.getParameterByName('referringURL');
          const zipCode = this.getParameterByName('zipCode');
          const marketingData = {
            campaignID: campaignID,
            currentURL: currentUrl,
            referringURL: referringURL,
            zipCode: zipCode
          };
          const queryParams: any = {};
          let urlParamsStr = '';
          if (window.location.search) {

            urlParamsStr = window.location.search.split('?')[1];
          } else {
            urlParamsStr = window.location.hash.split('?')[1];
          }

          if (urlParamsStr) {
            const urlParamsPairArr = urlParamsStr.split('&');
            if (urlParamsPairArr.length) {
              urlParamsPairArr.forEach(pair => {
                const paramKeyValArr = pair.split('=');
                queryParams[paramKeyValArr[0]] = paramKeyValArr[1];
              });
            }
          }
          // queryParams.campaignID = campaignID;
          // queryParams.referringURL = referringURL;
          // queryParams.zipCode = zipCode;
          this.store.dispatch(new LeadActions.SaveMarketingData(marketingData));
          router.navigate([visibleRouteList[0].routeName], { queryParams: queryParams, queryParamsHandling: 'merge' });
          // router.navigate([visibleRouteList[0].routeName + '?' + urlParams.toString()]);
          // router.navigate([visibleRouteList[0].routeName]);
          resolve(true);
        }
      });
    });
  }
  configRoutes() {

  }
  getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name.toUpperCase() + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url.toUpperCase());
    if (!results) { return null; }
    if (!results[2]) { return ''; }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
