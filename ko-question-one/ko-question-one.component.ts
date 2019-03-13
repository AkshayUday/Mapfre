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
  selector: 'verti-ko-question-one',
  templateUrl: './ko-question-one.component.html',
  styleUrls: ['./ko-question-one.component.scss']
})
export class KoQuestionOneComponent implements OnInit, OnDestroy {
  koQuestionOne: FormGroup;
  koTitle: string;
  koList: string[];
  koQuestionOne$: Subscription;
  imgSource: string;
  eligibilityAnswers: any;
  leadSub: Subscription;
  loaderSubscription: Subscription;
  loaderStopped: boolean;
  constructor(private fb: FormBuilder, private router: Router, private store: Store<any>, private navService: NavigationService) {
    // this.koTitle = 'Does your quote need to include any of the vehicles below that we don\'t insure?';
    this.imgSource = './assets/img/Icon_rocket.svg';
    this.koTitle = 'Listed below are vehicle types we don\'t insure. Does your quote need to include coverage for any of these?';
    this.koList = [
      'Motorcycle',
      'Car/Truck built prior to 1981',
      'Custom vehicle or conversion van',
      'Motor home, recreational vehicle or travel trailer',
      'All-terrain vehicle (ATV)',
      'Salvaged & branded vehicles'
    ];
  }

  ngOnInit() {
    this.koQuestionOne = this.fb.group({
      ineligibleVehicle: ['', Validators.required],
    });

    this.koQuestionOne$ = this.store.select(fromStore.quoteSelector)
      .pipe(distinctUntilChanged()).subscribe((quote) => {
        if (quote && quote.eligibilityAnswers) {
          this.eligibilityAnswers = quote.eligibilityAnswers;
          this.koQuestionOne.patchValue(this.eligibilityAnswers);
        }
      });
    this.navService.upDateMarketingData();
  }

  // saveDetails() {
  koQuestion() {
    this.store.dispatch(new LeadActions.SaveQuote({
      'eligibilityAnswers': {
        ...this.eligibilityAnswers,
        ...this.koQuestionOne.value
      }
    }));
    // if (this.koQuestionOne.value.koQuestionOneValue === 'no') {
    //   this.router.navigate(['/kodecline']);
    // } else {
    //   this.navService.navigate();
    //   // this.router.navigate(['/koqtwo']);
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
    if (this.koQuestionOne$) {
      this.koQuestionOne$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }

  }

}
