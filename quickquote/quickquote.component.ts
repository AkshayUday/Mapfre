import { Component, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';

import * as LeadActions from '../../store/actions/lead.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { distinctUntilChanged, take } from 'rxjs/operators';
import * as fromStore from '../../store/reducers/lead.reducers';
import { Lead } from '../../store/models/lead.model';
import { Router } from '@angular/router';

@Component({
  selector: 'verti-quickquote',
  templateUrl: './quickquote.component.html',
  styleUrls: ['./quickquote.component.scss'],
  animations: [
    trigger('fade',
      [
        state('void', style({ opacity: 0 })),
        transition(':enter', [animate(300)]),
        transition(':leave', [animate(500)]),
      ]
    )]
})
export class QuickquoteComponent implements OnInit, OnDestroy {
  showScrollContent: boolean;
  leadData$: any;
  leadData: Lead;
  isADPFQuote: boolean;
  premuimPrice: string;
  decimalPrice: string;
  vehiclesList = ['CG', 'CH', 'CP', 'CV', 'HB', 'SV', 'UT', 'PV', 'TU', 'WG', 'SD', 'ST'];
  vehicleData: any;
  constructor(@Inject(DOCUMENT) document, private store: Store<any>, private router: Router) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    // if (window.screen.width < 768) {
    if (window.pageYOffset > 50) {
      const element = document.getElementById('affix');
      const element2 = document.getElementById('sticky_next_coverage');
      element.classList.add('sticky');
      element2.classList.add('sticky-next-coverage');
      this.showScrollContent = true;
    } else {
      const element = document.getElementById('affix');
      const element2 = document.getElementById('sticky_next_coverage');
      element.classList.remove('sticky');
      element2.classList.remove('sticky-next-coverage');
      this.showScrollContent = false;
    }
    // }
  }

  ngOnInit() {
    this.leadData$ = this.store.select(fromStore.leadSelector)
      .pipe(distinctUntilChanged()).subscribe((leadData: Lead) => {
        this.leadData = leadData;
        this.vehicleData = leadData.quickQuote.vehicles.map(vehicle => {
          const vehicleIcon = {
            ...vehicle,
            iconExisted: this.checkBodyStyleCode(vehicle.bodyStyleCode),
          };
          return vehicleIcon;
        });

      });
    if (this.leadData.quickQuote.monthlyPremiumPrice) {
      let priceArr: any = this.leadData.quickQuote.monthlyPremiumPrice.toString();
      priceArr = priceArr.split('.');
      this.premuimPrice = priceArr[0];
      this.decimalPrice = priceArr[1];
    }

  }
  checkBodyStyleCode(bodyStyleCode) {
    if (bodyStyleCode) {
      return this.vehiclesList.includes(bodyStyleCode.trim());
    }
  }

  doContinue() {
    this.router.navigate(['/calltofinish']);
  }

  ngOnDestroy() {
    if (this.leadData$) {
      this.leadData$.unsubscribe();
    }
  }

}
