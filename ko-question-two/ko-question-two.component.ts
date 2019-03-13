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
  selector: 'verti-ko-question-two',
  templateUrl: './ko-question-two.component.html',
  styleUrls: ['./ko-question-two.component.scss']
})
export class KoQuestionTwoComponent implements OnInit, OnDestroy {
  koQuestionTwo: FormGroup;
  koTitle: string;
  koListTitle: string;
  koList: string[];
  koQuestionTwo$: Subscription;
  imgSource: string;
  eligibilityAnswers: any;
  leadSub: Subscription;
  loaderSubscription: Subscription;
  loaderStopped: boolean;
  constructor(private fb: FormBuilder, private router: Router, private store: Store<any>, private navService: NavigationService) {
    // this.koTitle = 'In the last 5 years have you been convicted of any major violations?';
    this.imgSource = './assets/img/Icon_Cop.svg';
    this.koTitle = 'In the last 5 years, have you been convicted of any major violations like:';
    // this.koListTitle = 'Common examples are:';
    // this.koList = [
    //   'Driving under the influence of alcohol',
    //   'Drag racing',
    //   'Fleeing or eluding police',
    //   'Passing a stopped school bus',
    //   'Reckless driving',
    //   'Revoked license',
    //   'Vehicle assault/felony/homicide'
    // ];
    this.koList = [
      'Driving under the influence of alcohol',
      'Drag racing',
      'Fleeing or eluding police',
      'Passing stopped school bus',
      'Reckless driving',
      'Vehicle assault/felony/homicide',
    ];
  }

  ngOnInit() {
    this.koQuestionTwo = this.fb.group({
      majorViolations: ['', Validators.required],
    });

    this.koQuestionTwo$ = this.store.select(fromStore.quoteSelector)
      .pipe(distinctUntilChanged()).subscribe((quote) => {
        if (quote && quote.eligibilityAnswers) {
          this.eligibilityAnswers = quote.eligibilityAnswers;
          this.koQuestionTwo.patchValue(this.eligibilityAnswers);
        }
      });
    this.navService.upDateMarketingData();
  }

  koQuestion() {
    this.store.dispatch(new LeadActions.SaveQuote({
      'eligibilityAnswers':
        { ...this.eligibilityAnswers, ...this.koQuestionTwo.value }
    }));
    // this.router.navigate(['/koqthree']);
    // if (this.koQuestionTwo.value.koQuestionTwoValue === 'no') {
    //   this.router.navigate(['/kodecline']);
    // } else {
    //   this.navService.navigate();
    //   // this.router.navigate(['/koqthree']);
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
    if (this.koQuestionTwo$) {
      this.koQuestionTwo$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }


}
