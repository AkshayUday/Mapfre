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
  selector: 'verti-minor-violation-questions',
  templateUrl: './minor-violation-questions.component.html',
  styleUrls: ['./minor-violation-questions.component.scss']
})
export class MinorViolationQuestionsComponent implements OnInit, OnDestroy {
  minorViolation: FormGroup;
  data;
  allViolationsList;
  koTitle: string;
  koListTitle: string;
  koList: string[];
  minorViolation$: Subscription;
  leadSub: Subscription;
  loaderSubscription: Subscription;
  loaderStopped: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<any>, private navService: NavigationService
  ) {
    this.allViolationsList = [
      {
        formControl: 'noOfMovingViolations',
        subtitle:
          'How many moving violations have you had?',
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
        subtitle: 'How many AT FAULT accidents have you been involved in?'
      },
      {
        formControl: 'noOfNotAtFaultAccidents',
        subtitle: 'How many NOT AT FAULT accidents have you been involved in?'
      },
      {
        formControl: 'noOfComprehensiveClaims',
        subtitle: 'How many comprehensive claims have you made?',
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
  }

  ngOnInit() {
    this.minorViolation = this.fb.group({
      noOfMovingViolations: ['none', Validators.required],
      noOfAtFaultAccidents: ['none', Validators.required],
      noOfNotAtFaultAccidents: ['none', Validators.required],
      noOfComprehensiveClaims: ['none', Validators.required]
    });

    this.minorViolation$ = this.store.select(fromStore.leadSelector)
      .pipe(distinctUntilChanged()).subscribe((leadData) => {
        if (leadData) {
          this.minorViolation.patchValue(leadData);
        }
      });
    this.navService.upDateMarketingData();
  }

  saveQuestion() {
    this.store.dispatch(new LeadActions.SavePNIData(this.minorViolation.value));
  }

  nextQuestion() {
    if (this.minorViolation.valid) {
      this.loaderStopped = false;
      // this.router.navigate(['/koqthree']);
      this.leadSub = this.store.select(fromStore.leadSelector).pipe(take(1)).subscribe((leadData: Lead) => {
        this.store.dispatch(new LeadActions.PostLeadAction(leadData));
      });
      this.loaderSubscription = this.store.select(state => state.loader.isLoading).pipe(distinctUntilChanged()).subscribe(loading => {
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
  }

  ngOnDestroy() {
    if (this.minorViolation$) {
      this.minorViolation$.unsubscribe();
    }
    if (this.leadSub) {
      this.leadSub.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }
}
