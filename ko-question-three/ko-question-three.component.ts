import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as LeadActions from '../../store/actions/lead.actions';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../core/services/navigation.service';
import * as fromStore from '../../store/reducers/lead.reducers';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { Lead } from '../../store/models/lead.model';
@Component({
  selector: 'verti-ko-question-three',
  templateUrl: './ko-question-three.component.html',
  styleUrls: ['./ko-question-three.component.scss']
})
export class KoQuestionThreeComponent implements OnInit, OnDestroy {

  koQuestionThree: FormGroup;
  koTitle: string;
  koListTitle: string;
  koList: string[];
  koQuestionThree$: Subscription;
  imgSource: string;
  eligibilityAnswers: any;
  leadSub: Subscription;
  loaderSubscription: Subscription;
  loaderStopped: boolean;
  constructor(private fb: FormBuilder, private router: Router, private store: Store<any>, private navService: NavigationService) {
    // this.koTitle = 'In the last 5 years has your driver\'s license been suspended or revoked?';
    this.imgSource = './assets/img/Icon_driverlicense.svg';
    this.koTitle = `Is your driver’s license suspended/revoked currently or
    has it been in the last 5 years?`;
  }

  ngOnInit() {
    this.koQuestionThree = this.fb.group({
      licenseRevoked: ['', Validators.required],
    });

    this.koQuestionThree$ = this.store.select(fromStore.quoteSelector)
      .pipe(distinctUntilChanged()).subscribe((quote) => {
        if (quote && quote.eligibilityAnswers) {
          this.eligibilityAnswers = quote.eligibilityAnswers;
          this.koQuestionThree.patchValue(this.eligibilityAnswers);
        }
      });
    this.navService.upDateMarketingData();
  }

  koQuestion() {
    this.store.dispatch(new LeadActions.SaveQuote({
      'eligibilityAnswers':
        { ...this.eligibilityAnswers, ...this.koQuestionThree.value }
    }));
    // this.router.navigate(['/drivinghistory']);
    // this.router.navigate(['/kodecline']);
    // if (this.koQuestionThree.value.koQuestionThreeValue === 'no') {
    //   this.router.navigate(['/kodecline']);
    // } else {
    //   this.navService.navigate();
    //   // this.router.navigate(['/drivinghistory']);
    // }
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

  ngOnDestroy() {
    if (this.koQuestionThree$) {
      this.koQuestionThree$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }

}
